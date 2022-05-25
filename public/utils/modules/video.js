function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    socket.on('listUserOnline',({usersOnline}) => {
        console.log(usersOnline);
    })
    videoGrid.append(video);
    console.log(videoGrid);
}

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    console.log('call');
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    }) 

    peers[userId] = call;
}