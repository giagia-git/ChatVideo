const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./public/database/db');
const formatMessage = require('./public/utils/message');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./public/utils/user');
require('dotenv').config();
const fs = require('fs');
const moment = require('moment');


// Routing
app.use(express.static(path.join(__dirname, '/public')));

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const use__router = require(__dirname + "/public/router/main");
app.use('/',use__router);

const botName = 'ZoomCard Bot';

io.on('connection', socket => {

    // Thay doi mat khau
    socket.on('userchangepassword', ({email,passwordold,passwordnew}) => {
        console.log(email,passwordold,passwordnew);
        const queryFormChangePassword = `SELECT * FROM User WHERE U_email = ? AND U_password = ?`;
        db.query(queryFormChangePassword,[email,passwordold], (err,results) => {
            if(err) throw err;
            if(results.length > 0) {
                console.log('Người dùng thay đổi mật khẩu thành công');
                const updatePasswordUser = `UPDATE User SET U_password = ? WHERE U_email = ?`;
                db.query(updatePasswordUser,[passwordnew,email],(error,data) => {
                    if(err) throw err;
                    if(data.affectedRows > 0) {
                        socket.emit('changepasswordsuccess',{status: true});
                    } else {
                        
                    }
                })
            } else {
                console.log('Mật khẩu cũ nhập vào không hợp lệ');
                socket.emit('inputpasswordoldfailed', {status: false});
            }
        }) 
    });

    // Kiem tra form dang nhap
    socket.on('inputFormSignin',({email,password}) => {
        console.log(email,password);
        const queryFormSignin = `SELECT * FROM User WHERE U_email = ? AND U_password = ? AND trangthai = "Active"`;
        db.query(queryFormSignin,[email,password], (err,results) => {
            if(err) throw err;
            if(results.length > 0) {
                console.log('Dang nhap thanh cong');
                socket.emit("statusFormSignin", {status: true});
            } else {
                console.log('Dang nhap that bai');
                socket.emit("statusFormSignin", {status: false});
            }
        }) 
    })
    
    socket.on('inputFormSignup',({email,password}) => {
        const objDate = new Date();
        let dayNow = objDate.getDate()+1;
        let monthNow = objDate.getMonth()+1;
        let yearNow = objDate.getFullYear();

        const queryFormSignup = `SELECT * FROM User WHERE U_email = ?`;
        db.query(queryFormSignup,[email], (err,results) => {
            if(err) throw err;
            if(results.length > 0) {
                console.log('Tai khoan dang ky da ton tai');
                socket.emit("statusFormSignup", {status: false});
            } else {
                const insertFormSignup = `INSERT INTO User(U_email,U_password,U_thoigiantao,trangthai) VALUES(?,?,?,?)`;
                db.query(insertFormSignup,[email,password,yearNow+"-"+monthNow+"-"+dayNow,"Active"],(error,data) => {
                    if(error) throw err;
                    if(data.affectedRows > 0) {
                        console.log('Save data is to database success!!');
                        console.log('Dang ky tai khoan thanh cong');
                        socket.emit("statusFormSignup", {status: true});
                    } else {
                        socket.emit("statusFormSignup", {status: false});
                    }
                })
            }
        }) 
    })

     // Kiem tra form dang nhap admin
    socket.on('inputFormSigninAdmin',({account,password}) => {
        const queryFormSignin = `SELECT * FROM UserAdmin WHERE UA_account = ? AND UA_password = ?`;
        db.query(queryFormSignin,[account,password], (err,results) => {
            if(err) throw err;
            if(results.length > 0) {
                console.log('Dang nhap thanh cong');
                socket.emit("statusFormSigninAdmin", {status: true});
            } else {
                console.log('Dang nhap that bai');
                socket.emit("statusFormSigninAdmin", {status: false});
            }
        }) 
    })

    socket.on('blockStatusUser', ({id}) => {
        const queryDeleteUser = `UPDATE User SET trangthai = 'Block' WHERE U_id = ?`;
        db.query(queryDeleteUser,[id], (err,results) => {
            if(err) throw err;
            console.log(results);
            if(results.affectedRows > 0) {
                console.log('Update trang thai tai khoan boi quan tri vien thanh cong');
                socket.emit('statusBlockUser',{status: true});
            } else {
                console.log('Update trang thai tai khoan boi quan tri vien that bai');
                socket.emit('statusBlockUser',{status: false});
            }
        })
    });

    socket.on('openblockStatusUser', ({id}) => {
        const queryDeleteUser = `UPDATE User SET trangthai = 'Active' WHERE U_id = ?`;
        db.query(queryDeleteUser,[id], (err,results) => {
            if(err) throw err;
            console.log(results);
            if(results.affectedRows > 0) {
                console.log('Update trang thai tai khoan boi quan tri vien thanh cong');
                socket.emit('statusOpenBlockUser',{status: true});
            } else {
                console.log('Update trang thai tai khoan boi quan tri vien that bai');
                socket.emit('statusOpenBlockUser',{status: false});
            }
        })
    });

    socket.on('deleteUser', ({id}) => {
        const queryDeleteUser = `DELETE FROM User WHERE U_id = ?`;
        db.query(queryDeleteUser,[id], (err,results) => {
            if(err) throw err;
            console.log(results);
            if(results.affectedRows > 0) {
                console.log('Xoa tai khoan boi quan tri vien thanh cong');
                socket.emit('statusDeleteUser',{status: true});
            } else {
                console.log('Xoa tai khoan boi quan tri vien that bai');
                socket.emit('statusDeleteUser',{status: false});
            }
        })
    })
    



    console.log("socket.id: " + socket.id);
    socket.on('joinRoom', ({ userPeerId, username, room }) => {

        const user = userJoin(userPeerId, username, room);

        if (!user) {
            socket.emit('sameName');
        } else {
            console.log('socket.join(user.room)');
            socket.join(user.room);

            socket.on('sendFileImage', informationFile => {
                io.to(user.room).emit('resFileImage',{username: username,time: moment().format('h:mm a'), nameFile: informationFile.nameFile, path: informationFile.path});
            })
        
            socket.on('sendFileApplication', informationFile => {
                console.log('sendFileApplication' + informationFile);
                io.to(user.room).emit('resFileApplication',{username: username,time: moment().format('h:mm a'), nameFile: informationFile.nameFile,typeFile: informationFile.typeFile,sizeFile: informationFile.sizeFile});
            })
        
            // only show in client to the user connecting
            socket.emit('message', formatMessage(botName, 'Welcome to ZoomCord!'));

            // Broadcast to all except the user itself in a specif room
            socket.broadcast
                .to(user.room)
                .emit(
                    'message',
                    formatMessage(botName, `${user.username} has joined the chat`)
                );
            console.log(`user.name: ${user.username}, peerId: ${userPeerId}`);

            socket.broadcast.to(user.room).emit('user-connected', userPeerId)

            // // Send users and room info
            // io.to(user.room).emit('roomUsers', {
            //     room: user.room,
            //     users: getRoomUsers(user.room) 
            // });

            socket.on('typing', () => {
                console.log('typing');

                socket.broadcast
                    .to(user.room)
                    .emit('typing', {
                        username: user.username
                    });
            });

            socket.on('stop typing', () => {
                console.log('stop typing');

                socket.broadcast
                    .to(user.room)
                    .emit('stop typing', {
                        username: user.username
                    });
            });

            // Listen for chatMessage
            socket.on('chatMessage', msg => {
                const user = getCurrentUser(userPeerId);

                // Broadcast to all clients in the room
                io
                    .to(user.room)
                    .emit('message', formatMessage(user.username, msg));
            });

            // Runs when client disconnects
            socket.on('disconnect', () => {
                const user = userLeave(userPeerId);

                if (user) {
                    io
                    .to(user.room)
                    .emit('message', formatMessage(botName, `${user.username} has left the chat`));
                }

                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });

                socket.broadcast.to(user.room).emit('user-disconnected', userPeerId)
            });
        }
    })

    // socket.on('uploadfile', async data => {
    //     const uploadFiletoDatabase = `INSERT INTO Image(I_name,I_mimetype) VALUES(?,?)`;
    //     await db.query(uploadFiletoDatabase,[data.originalname,data.mimetype],(err,results) => {
    //         if(err) throw err;
    //         if(results.affectedRows > 0) {
    //             console.log('Save data to database success');
    //         } else {
    //             console.log('Save data to database failed');
    //         }
    //     })
    // })
});

db.connect(() => {
    console.log('Database is running...');
})

server.listen(process.env.PORT, () => {
    console.log(`Server is running PORT ${process.env.PORT}...`);
})

module.exports = io;