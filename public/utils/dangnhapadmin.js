let SigninFormAdmin = document.getElementById('signin-formadmin');
let InputAccountFormAdmin = SigninFormAdmin.taikhoan;
let InputPasswordFormAdmin = SigninFormAdmin.password;
const socket = io('http://localhost:3000');

console.log(SigninFormAdmin);

window.addEventListener('load', () => {;
    // Focus input email khi load page success
    InputAccountFormAdmin.focus(); 

    socket.on('statusFormSigninAdmin',async res => {
        if(res.status === true) {  
            alert('Đăng nhập page admin thành công');
            socket.emit('AccessFormSigninAdmin',{account: InputAccountFormAdmin.value,content: 'Check form dang nhap thanh cong'});
            window.location.assign(`http://localhost:3000/administrator?email=${InputAccountFormAdmin.value}`);
        } else {
            alert('Tài khoản đăng nhập không thành công!!');
            // inputEmailForm.value = '';
            InputPasswordFormAdmin.value = '';
        }
    })
        
    SigninFormAdmin.addEventListener('submit',(event) => {
        socket.emit('inputFormSigninAdmin',{account: InputAccountFormAdmin.value,password: InputPasswordFormAdmin.value});
        event.preventDefault();
    })
});
