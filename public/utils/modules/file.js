
var fileForm = document.querySelector('.formFile');

async function changeHandler(event) {
    event.preventDefault();
    const myfile = event.target.files[0];
    const nameFile = myfile.name;
    const mimetypeFile = myfile.type;
    const sizeFile = myfile.size;
    const myurl = document.getElementById('myUrl');
    myurl.textContent = window.location.href;

    localStorage.setItem('nameFile',nameFile);
    localStorage.setItem('mimetypeFile',mimetypeFile);

    const fileurlOfLocalstorage = localStorage.getItem('nameFile');
    const typefileOfLocalStorage = localStorage.getItem('mimetypeFile');

    const idxfileType = typefileOfLocalStorage.indexOf('/');
    const typeFile = typefileOfLocalStorage.slice(0,idxfileType);

    // Size < 1MB && typeFile = ['image','application']
    if(checksizeFile(sizeFile) && checktypeFile(typeFile)) {
        const theinput = document.getElementById('file');
        const data = new FormData();
        data.append('myfile',theinput.files[0]);
        fetch('/uploadfile',{method:'POST',body: data});
        switch(typeFile) {
            case "application" :
                console.log('application');
                console.log(nameFile,typeFile,sizeFile);
                socket.emit('sendFileApplication',{nameFile: nameFile,typeFile: mimetypeFile,sizeFile: sizeFile});
                break;
            case "image" :
                console.log('image');
                if(fileurlOfLocalstorage) {
                    console.log(fileurlOfLocalstorage);
                    await axios.get(`/uploads/${fileurlOfLocalstorage}`)
                    .then(res => {
                        console.log(res);
                        console.log(res.request.responseURL);
                        socket.emit('sendFileImage',{nameFile: fileurlOfLocalstorage,path: res.request.responseURL});
                    })
                    .catch(err => console.log(err));
                    localStorage.removeItem('nameFile');
                }
                break
            case "audio" :
                break;
        }
    } else {
        alert('Không thể gửi file');
    }
}


const acceptFileType = ['image','application'];

function checksizeFile(size) {
    return true;
    // console.log(size);
    // if(size < 1048000) {
    //     return true;
    // }
    // return false;
}

function checktypeFile(type) {
    const typeFile = acceptFileType.some(e => e === type);
    console.log(typeFile);
    if(typeFile) {
        return true;
    }
    return false;
}

const mainChat = document.querySelector('.main__chat_window');
    // Scroll bottom
    mainChat.scrollTop = mainChat.scrollHeight;
    console.log(mainChat.scrollHeight);

socket.on('resFileImage', infoFile => {
    outputFileImage(infoFile);
    mainChat.scrollTop = mainChat.scrollHeight - mainChat.clientHeight;
})

socket.on('resFileApplication', infoFile => {
    outputFileApplication(infoFile);
    mainChat.scrollTop = mainChat.scrollHeight - mainChat.clientHeight;
});

function outputFileApplication(file) {
    console.log(file);
    const div = document.createElement('div');
    div.classList.add('message');

    var pUsername = document.createElement('p');
    var spanTime = document.createElement('span');

    pUsername.classList.add('meta');
    pUsername.innerText = file.username + ' ';

    spanTime.innerText = file.time;
    pUsername.appendChild(spanTime);

    div.appendChild(pUsername);

    const divMain = document.createElement('div');
    divMain.classList.add('file__application');

    const divChildLeft = document.createElement('div');
    const divChildCenter = document.createElement('div');
    const divChildRight = document.createElement('div');

    divChildLeft.classList.add('file__application__left');
    divChildCenter.classList.add('file__application__center');
    divChildRight.classList.add('file__application__right');

    divChildLeft.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" fill="currentColor" class="bi bi-file-earmark-check" viewBox="0 0 16 16">
    <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
  </svg>
    `

    divChildRight.innerHTML = `
        <a href='http://localhost:3000/uploads/${file.nameFile}'>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
        </a>
    `

    var p = document.createElement('p');
    p.innerText = file.nameFile;

    file.sizeFile = Math.round(file.sizeFile / 1000);

    var p1 = document.createElement('p');
    p1.innerText = file.sizeFile + " KB";

    divChildCenter.appendChild(p);
    divChildCenter.appendChild(p1);

    divMain.appendChild(divChildLeft);
    divMain.appendChild(divChildCenter);
    divMain.appendChild(divChildRight);

    div.appendChild(divMain);

    console.log(div);

    document.querySelector('.chat-messages').appendChild(div);
}

function outputFileImage(file) {
    console.log(file);
    const div = document.createElement('div');
    div.classList.add('message');

    const divMain = document.createElement('divMain');

    var pUsername = document.createElement('p');
    var spanTime = document.createElement('span');
    pUsername.classList.add('meta');
    pUsername.innerText = file.username + ' ';

    spanTime.innerText = file.time;
    pUsername.appendChild(spanTime);

    const image = document.createElement('img');
    image.src = file.path;
    image.style.width = "100%";
    image.style.height = "100%";

    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = file.nameFile;
    p.style.textAlign = "center";

    divMain.appendChild(image);
    divMain.appendChild(p);

    divMain.addEventListener('click', (event) => {
        open(`http://localhost:3000/uploads/${file.nameFile}`);
    })

    div.appendChild(pUsername);
    div.appendChild(divMain);
    document.querySelector('.chat-messages').appendChild(div);
}