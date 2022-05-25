const socket = io('http://localhost:3000');
const myPeer = new Peer();
const peers = {};

let typing = false;
let lastTypingTime;
const TYPING_TIMER_LENGTH = 400; // ms

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const inputMessage =document.getElementById('msg');

const chatContainer = document.querySelector('.chat-container');

console.log(muteButton);
console.log(stopVideo);

const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true
let myVideoStream = null;

const { username, room, email } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

myPeer.on('open', userPeerId => {
    console.log(`userPeerId: ` + userPeerId);

    // On join chatroom
    socket.emit('joinRoom', { userPeerId, username, room });
})

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        console.log('answer');
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        // connectToNewUser(userId, stream)
        console.log("userId: " + userId);
        console.log('user-connected-stream: ' + stream);
        // make sure myPeer.on('call') has been executed first
        setTimeout(connectToNewUser,1000,userId,stream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

socket.on('sameName', () => {
    alert("Username already exist, please choose another username.");
    window.history.back();
});

document.onkeydown = fkey;
document.onkeypress = fkey
document.onkeyup = fkey;

function fkey(e){
    e = e || window.event;
    if (e.code === 'F5') {
        alert('Cuộc gọi bị kết thúc');
        window.location.assign(`/home?email=${email}`);
    }
}

const outRoom = () => {
    alert('Cuộc gọi kết thúc'); 
    window.location.assign(`/home?email=${email}`);
}