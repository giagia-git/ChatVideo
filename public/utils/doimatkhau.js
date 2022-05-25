const socket = io('http://localhost:3000');

const EmailOfAccount = document.querySelector('.dropdown-account');
const btnSignout = document.getElementById('btn__signout');
const InputFormChangePassword = document.querySelector('.changepassword__form');
const InputPassworldOld = InputFormChangePassword[0];
const InputPassworldNew = InputFormChangePassword[1];
const InputRepassword = InputFormChangePassword[2];

window.addEventListener('load', (event) => {
    const stringURL = window.location.search.slice(window.location.search.indexOf('=')+1);
    EmailOfAccount.textContent = stringURL;

  // Kiem tra URL
    if(!window.location.search.indexOf(stringURL) > 0) {
        window.location.assign('http://localhost:3000/dangnhap');
    }

    socket.on('inputpasswordoldfailed', ({status}) => {
        alert('Mật khẩu cũ nhập không đúng');
        InputPassworldOld.value = '';
    })

    socket.on('changepasswordsuccess', ({status}) => {
        alert('Thay đổi mật khẩu thành công');   
        InputPassworldOld.value = '';
        InputPassworldNew.value = '';
        InputRepassword.value = '';
    })

    // Nguoi dung chon dang xuat
    btnSignout.addEventListener('click', (event) => {
        const allowLogout = confirm('Bạn có muốn đăng xuất?');
        if(allowLogout) {
            alert('Đăng xuất thành công');
            window.location = "http://localhost:3000";
        }
    })

    console.log(window.location.search);
    const paramsofPage = window.location.search.slice(7);
    InputPassworldOld.focus();
    InputFormChangePassword.addEventListener('submit', e => {
        e.preventDefault();
        let passwordold = e.target.passwordold.value;
        let passwordnew = e.target.passwordnew.value;
        let repassword = e.target.repassword.value;

        // Kiem tra mat khau moi
        if(passwordnew !== repassword) {
            alert('Mật khẩu mới không hợp lệ');
            e.target.passwordnew.value = '';
            e.target.repassword.value = '';
        } else {
            // Mat khau moi qua 15 ky tu
            if(passwordnew.length > 15 && repassword.length > 15) {
                alert('Mật khẩu vượt quá 15 ký tự');
                e.target.passwordnew.value = '';
                e.target.repassword.value = '';
            } else {
                socket.emit('userchangepassword',{email: paramsofPage,passwordold: e.target.passwordold.value, passwordnew: e.target.passwordnew.value});
            }
        }
    })
})