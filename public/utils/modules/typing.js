inputMessage.addEventListener("input", () => {
    updateTyping();
});

// Updates the typing event
const updateTyping = () => {
    if (!typing) {
        typing = true;
        socket.emit('typing');
    }
    lastTypingTime = (new Date()).getTime();

    setTimeout(() => {
    const typingTimer = (new Date()).getTime();
    const timeDiff = typingTimer - lastTypingTime;
    if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        socket.emit('stop typing');
        typing = false;
    }
    }, TYPING_TIMER_LENGTH);
}

// Adds the visual chat typing message
const addChatTyping = (data) => {
    data.typing = true;
    data.message = ' đang nhập nội dung..';
    addTypingMessage(data);
}

// Removes the visual chat typing message
const removeChatTyping = (data) => {
    const typingElement = document.getElementsByClassName('typing')

    while (typingElement.length > 0) typingElement[0].remove();
}

 // Adds the visual chat message to the message list
 const addTypingMessage = (data, options) => {
    const typingClass = data.typing ? 'typing' : '';
    const div = document.createElement('div');
    div.classList.add(typingClass);

    const p = document.createElement('p');
    p.innerText = data.username + data.message;

    div.appendChild(p);

    document.querySelector('.is-typing').appendChild(div);
}

socket.on('typing', (data) => {
    addChatTyping(data);
});

// Whenever the server emits 'stop typing', kill the typing message
socket.on('stop typing', (data) => {
    removeChatTyping(data);
});