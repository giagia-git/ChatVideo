const dateNow = new Date();
const btnBlockaccount = document.getElementById('btn-blockaccount');
const btnDeleteaccount = document.getElementById('btn-deleteaccount');
const btnOpenblockaccount = document.getElementById('btn-openblockaccount');
const btnSignoutPage = document.getElementById('btn-signout');
const socket = io('http://localhost:3000');

const urlInforAllUsers = '/administrator/inforallusers';

const fetchInfoAllUsers = async (url) => {
    await axios.get(url)
    .then(res => {
        let listShowInfo = res.data;
        let rot = $("#contacts")[0];
        let childItems = $(".contacts-item");

        console.log(res);

        listShowInfo.map((ele,idx) => {
            const tr = document.createElement("tr");
            const Arraytd = [];

            for(let i=0;i<childItems.length;++i) {
                var td = document.createElement("td");
                Arraytd.push(td);
            }

            const idxTimeCreate = ele.U_thoigiantao.indexOf('T');
            ele.U_thoigiantao = ele.U_thoigiantao.slice(0,idxTimeCreate);

            switch(ele.trangthai) {
                case "Active" :
                    break;
                case "Status Block" :
                    break;
            }

            Arraytd[0].innerHTML = ele.U_id;
            Arraytd[1].innerHTML = ele.U_email;
            Arraytd[2].innerHTML = ele.U_fullname;
            Arraytd[3].innerHTML = ele.U_password;
            Arraytd[4].innerHTML = ele.U_sodienthoai;
            Arraytd[5].innerHTML = ele.U_diachi;
            Arraytd[6].innerHTML = ele.U_thoigiantao;
            Arraytd[7].innerHTML = ele.trangthai;
            Arraytd.map((td,idx) => {
                tr.appendChild(td);
            })
            rot.appendChild(tr);
            console.log(rot);
        });
    })
    .catch(err => console.log(err));
}

window.addEventListener('load', () => {
    fetchInfoAllUsers(urlInforAllUsers);

    btnBlockaccount.addEventListener('click', (event) => {
        const resultConfirmBlock = prompt('Nhập vào ID người dùng muốn khóa');
        if(!resultConfirmBlock) {
            console.log('Không hợp lệ');
        } else {
            socket.emit("blockStatusUser",{id: resultConfirmBlock});
        }
    })

    btnOpenblockaccount.addEventListener('click', (event) => {
        const resultConfirmOpenBlock = prompt('Nhập vào ID người dùng muốn mở khóa');
        if(!resultConfirmOpenBlock) {
            console.log('Không hợp lệ');
        } else {
            socket.emit("openblockStatusUser",{id: resultConfirmOpenBlock});
        }
    })

    btnDeleteaccount.addEventListener('click', (event) => {
        const resultConfirmDelete = prompt('Nhập vào ID người dùng muốn xóa');
        if(!resultConfirmDelete) {
            console.log('Không hợp lệ');
        } else {
            socket.emit("deleteUser",{id: resultConfirmDelete});
        }
    })
    
    // Cap nhat trang thai tai khoan
    socket.on('statusBlockUser', ({status}) => {
        if(status) {
            alert('Update trang thai tai khoan thanh cong');
        } else {
            alert('Update trang thai tai khoan that bai');
        }
    })        

    // Mo khoa tai khoan
    socket.on('statusOpenBlockUser', ({status}) => {
        if(status) {
            alert('Update trang thai tai khoan thanh cong');
        } else {
            alert('Update trang thai tai khoan that bai');
        }
    })

    // Xoa tai khoan 
    socket.on('statusDeleteUser',({status}) => {
        if(status) {
            alert('Xoa tai khoan thanh cong');
        } else {
            alert('Xoa tai khoan that bai');
        }
    })

    btnSignoutPage.addEventListener('click', event => {
        const resultSignout = confirm("đăng xuất?");
        if(resultSignout) {
            window.location.assign('/admin');
        }
    })
});