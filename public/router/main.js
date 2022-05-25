const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../database/db');
const multer = require('multer');

router.get('/', (req,res) => {
    res.redirect('/dangnhap');
})

router
.get('/dangnhap', (req,res) => {
    res.sendFile(path.join(__dirname, "../views/dangnhap.html"));
})
.post('/dangnhap', (req,res) => {
    console.log(req.body);
    const queryFormSignin = `SELECT * FROM User WHERE U_email = ? AND U_password = ?`;
    db.query(queryFormSignin,[req.body.email,req.body.password], (err,results) => {
        if(err) throw err;
        if(results.length > 0) {
            return res.status(200).redirect('/home');
        } else {
            return res.status(200).redirect('/dangnhap');
        }
    }) 
});

router
.get('/dangky', (req,res) => {
    res.sendFile(path.join(__dirname, "../views/dangky.html"));
})

router
.get('/doimatkhau', (req,res) => {
    res.sendFile(path.join(__dirname, "../views/doimatkhau.html"));
});

router.get('/home', (req,res) => {
    res.sendFile(path.join(__dirname, "../views/home.html"));
})

router.get('/meet', (req,res) => {
    res.sendFile(path.join(__dirname, "../views/meet.html"));
})

router.get('/admin', (req,res) => {
    res.sendFile(path.join(__dirname, "../views/dangnhapadmin.html"));
})

router.get("/administrator", (req,res) => {
    res.sendFile(path.join(__dirname, "../views/administrator.html"));
})

router.get("/administrator/inforallusers", (req,res) => {
    const queryInforAllUsers = `SELECT * FROM User`;
    db.query(queryInforAllUsers, (err,results) => {
        if(err) throw err;
        console.log(results);
        if(results.length > 0) {
            return res.status(200).send(results);
        } else {
            return res.status(404).json({message: 'Error'});
        }
    })
})


// .post('/dangky', (req,res) => {
//     const queryFormSignup = `SELECT * FROM User WHERE U_email = ?`;
//     db.query(queryFormSignup,[req.body.email],(err,results) => {
//         if(err) throw err;
//         if(results.length > 0) {
//             return res.status(200).json({status: 200, message: 'Email da ton tai'});
//         } else {
//             const insertFormSignup = `INSERT INTO User(U_email,U_password) VALUES(?,?)`;
//             db.query(insertFormSignup,[req.body.email,req.body.password],(error,data) => {
//                 if(error) throw err;
//                 if(data.affectedRows > 0) {
//                     console.log('Save data is to database success!!');
//                     return res.status(200).redirect('/dangnhap');
//                 } else {
//                     return res.redirect('/dangky');
//                 }
//             })
//         }
//     })
// })


const storage = multer.diskStorage({
    destination: function(req,res,cb) {
        cb(null,'uploads');
    },
    filename: function(req,file,cb) {
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,filename + "-" +  file.originalname);
    }
})

var upload = multer({storage: storage});

router.post('/uploadfile', upload.single('myfile'),async (req,res) => {
    const file = req.file;
    console.log(file);
    if(!file) {
        console.log('Please upload a file');
    }


    const uploadFiletoDatabase = `INSERT INTO Image(I_name,I_path,I_mimetype) VALUES(?,?,?)`;
    await db.query(uploadFiletoDatabase,[req.file.originalname,req.file.path,req.file.mimetype],(err,results) => {
        if(err) throw err;
        if(results.affectedRows > 0) {
            return res.status(200).redirect(req.headers.referer); //Upload -> back
        } else {
            return res.json({
                status: 'failed',
                message: 'Luu image vao csdl that bai'
            })
        }
    })
})

router.get('/uploads/:originalnamefile', (req,res) => {
    const queryImageinDatabase = `SELECT * FROM Image WHERE I_name = '${req.params.originalnamefile}'`;
    db.query(queryImageinDatabase,(err,results) => {
        if(err) {
            throw err;
        } else {
            if(results.length > 0) {
                res.header("Content-Type",results[0].I_mimetype);
                res.sendFile(path.join(__dirname,`../../${results[0].I_path}`));
            } else {
                res.send('error');
            }
        }
    })
})

module.exports = router;