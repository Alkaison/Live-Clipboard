var socket = io()
const codeStatus = document.getElementById('clip-code')
const input = document.getElementById('input-box')
const statusline = document.getElementById('clip-status')

socket.on('reconnect_failed', ()=>{
    console.log('Reconnection error')
})
socket.on('connect_failed', ()=>{
    console.log('Connection error')
})

// connection with server from client side
socket.on('connect', function () {
    console.log('Connected to Server')
    setTimeout(() => {
        statusline.innerHTML = 'Wait .'
    }, 1000);
    setTimeout(() => {
        statusline.innerHTML = 'Wait ..'
    }, 2000);
    setTimeout(() => {
        statusline.innerHTML = 'Wait ...'
    }, 3000);
    setTimeout(() => {
        statusline.innerHTML = 'Connected'
    }, 5000);
    setTimeout(() => {
        let code = window.sessionStorage['code']
        // console.log(window.sessionStorage['code'])
        codeStatus.innerHTML = code
    }, 6000);
});

// message listener from server
socket.on('serverMessage', function (message) {
    console.log(message);
    setTimeout(() => { input.value = message.text}, 300)
});


// when disconnected from server
socket.on('disconnect', function () {
    setTimeout(() => {
        statusline.innerHTML = 'Disconnected......'
        codeStatus.innerHTML = '-----'
    }, 3000);
});

input.addEventListener('input', () => {
    console.log(input.value)
    setTimeout(() => {
        // send message to server
        socket.emit('clientMessage', {
            to: 'server',
            text: input.value,
            code: window.sessionStorage['code']
        });
    }, 2000);
})

