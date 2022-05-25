const btn__createaccount = document.querySelector('.btn-createaccount');
const SigninForm = document.getElementById('signin-form');
const inputEmailForm = document.getElementById('exampleInputEmail1');
const inputPassword = document.getElementById('exampleInputPassword1');
const socket = io('http://localhost:3000');

window.addEventListener('load', (event) => {
    // Focus input email khi load page success
    inputEmailForm.focus(); 

    socket.on('statusFormSignin',async res => {
        if(res.status === true) {  
            alert('đăng nhập thành công');
            socket.emit('AccessFormSignin',{email: inputEmailForm.value,content: 'Check form dang nhap thanh cong'});
            window.location.assign(`http://localhost:3000/home?email=${inputEmailForm.value}`);
        } else {
            alert('đăng nhập không thành công!!');
            // inputEmailForm.value = '';
            inputPassword.value = '';
        }
    })
    
    SigninForm.addEventListener('submit',(event) => {

        socket.emit('inputFormSignin',{email: inputEmailForm.value,password: inputPassword.value});
        event.preventDefault();
    })
    
    btn__createaccount.addEventListener('click', function(event) {
        window.location.assign('/dangky');
    })
});
