const EmailOfAccount = document.querySelector('.dropdown-account');
const btnSignout = document.getElementById('btn__signout');
const btnChangepassword = document.querySelector('#btn__changepassword');
const btnLinkGithub = document.querySelector('.header__right__github');
const btnLinkTwitter = document.querySelector('.header__right__twitter');
const formRegisryRoom = document.querySelector('.notification__room__registery');
const btnRegisteryRoom = document.querySelector('.btn__registery__room');
const btnOutFormRegisteryRoom = document.querySelector('.notification__room__registery__title > svg');
const addressFormRegistery = document.querySelector('.notification__room__registery__room > p > span');
const container = document.querySelector('.container');
const FormJoinRoom = document.getElementById('joinroom-form');

const socket = io('http://localhost:3000');

window.addEventListener('load', () => {
    // Lay params of url
    const stringURLemail = window.location.search.slice(window.location.search.indexOf('=')+1);
    EmailOfAccount.textContent = stringURLemail;

    // Submit form join room
    FormJoinRoom.addEventListener('submit', event => {
        event.preventDefault();
        const usernameFormJoinRoom = event.target.username.value;
        const keyFormJoinRoom = event.target.room.value;
        window.location.assign(`http://localhost:3000/meet?email=${stringURLemail}&username=${usernameFormJoinRoom}&room=${keyFormJoinRoom}`)
    })

    // Kiem tra URL
    if(!window.location.search.indexOf(stringURLemail) > 0) {
        window.location.assign('http://localhost:3000/dangnhap');
    }

    // Nguoi dung chon dang xuat
    btnSignout.addEventListener('click', (event) => {
        const allowLogout = confirm('Bạn có muốn đăng xuất?');
        if(allowLogout) {
            alert('Đăng xuất thành công');
            window.location = "http://localhost:3000";
        }
    })

    // Nguoi dung click link github
    btnLinkGithub.addEventListener('click', event => {
        window.location = "https://github.com/giagia-git?tab=repositories";
    })

    // Nguoi dung click link twitter
    btnLinkTwitter.addEventListener('click', event => {
        window.location = "https://twitter.com/home";
    })

    // Nguoi dung click tao room
    btnRegisteryRoom.addEventListener('click', event => {
        event.preventDefault();
        formRegisryRoom.style.opacity = "1";
        formRegisryRoom.style.zIndex = "9000";
        formRegisryRoom.classList.add('form__show');
        addressFormRegistery.innerHTML = makeid(8);
    })

    // Tat form dang ky room
    btnOutFormRegisteryRoom.addEventListener('click', event => {
        formRegisryRoom.style.opacity = "0";
        formRegisryRoom.style.zIndex = "0";
        formRegisryRoom.classList.remove('form__show');
    })

    // Chon chuc nang thay doi mat khau
    btnChangepassword.addEventListener('click', (event) => {
        console.log(window.location.search);
        const paramsofPage = window.location.search.slice(7);
        window.location.assign(`http://localhost:3000/doimatkhau?email=${paramsofPage}`);
    })

    function makeid(length) {
        var text = " mymeet.hoanggia/";
        var possible = "ABCDE@#-FGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
       
        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
       
        return text;
    }
})

    // window.addEventListener('click', event => {
    //     console.log(formRegisryRoom.classList.contains('form__show'));
    //     if(formRegisryRoom.classList.contains('form__show')) {
    //         if(event.target.classList.contains('notification__room__registery__item')) {
    //             console.log('true');
    //             formRegisryRoom.style.opacity = "0";
    //             formRegisryRoom.style.zIndex = "0";
    //             formRegisryRoom.classList.remove('form__show');
    //         }
    //     }
    // })


