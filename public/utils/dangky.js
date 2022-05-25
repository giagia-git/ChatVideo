const SignupForm = document.getElementById('signup-form');
const inputEmailForm = document.getElementById('exampleInputEmail1');
const inputPassword = document.getElementById('exampleInputPassword1');
const btnSignin = document.querySelector('.btn-signin');
const socket = io('http://localhost:3000');

window.addEventListener('load', (event) => {
    socket.on('statusFormSignup',async res => {
        if(res.status === true) {  
            alert('Đăng ký tài khoản thành công');
            window.location.assign(`http://localhost:3000/dangnhap`);
        } else {
            alert('Tài khoản đã tồn tại!!');
            inputEmailForm.value = '';
            inputPassword.value = '';
        }
    })
    
    SignupForm.addEventListener('submit',(event) => {
        console.log(event.target);
        let valueInputEmail = event.target.email.value;
        let valueInputPassword = event.target.password.value;
        console.log(valueInputEmail,valueInputPassword);
        socket.emit('inputFormSignup',{email: valueInputEmail,password: valueInputPassword});

        event.preventDefault();
    })

        // Quay tro ve page dang nhap
        btnSignin.addEventListener('click', event => {
            window.history.back();
        })
    
        // Focus input email khi load page success
        inputEmailForm.focus(); 
});
