// console.log(process.pid)
const express = require('express');
const socketIO = require('socket.io');
const os = require('os');
const http = require('http');
const port = 5000
var app = express();
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
let server = http.createServer(app);
var io = socketIO(server);

let text = 'Server is connected'

app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log('/ using server')
    res.sendFile(__dirname + "/public/index.html");
})
app.post("/", (req, res) => {
    let code = req.body.code
    console.log(code)
    if (code === '12345') {
        res.statusMessage = 'Code valid'
        res.statusCode = 200
        res.cookie('code', code)
        // res.send({'code': `valid`})
        res.send({ 'code': code })
    }
    else {
        res.statusMessage = 'Code does not exists'
        res.statusCode = 202
        res.setHeader('Content-Type', 'application/json;charset=utf-8')
        res.send({ 'message': `'${code}' does not exists...Try again or Create a new one instead` })
    }
})

app.get("/clipboard", (req, res) => {
    console.log('/clipboard using server')
    res.sendFile(__dirname + "/public/clipboard.html");

    // make connection with client from server side
    io.on('connection', (socket) => {
        console.log('New user connected');
        console.log(req.cookies)
        if (req.cookies['code']) {
            let code = req.cookies['code']
            socket.join(code)
            setTimeout(() => {
                io.sockets.in(code).emit('serverMessage', {
                    from: 'server',
                    text: text,
                })
            }, 1000)
        }
        // listen message from client
        socket.on('clientMessage', (message) => {
            console.log('clientMessage', message);
            text = message.text
            let code = req.cookies['code']
            if (code === '12345') {
                setTimeout(() => {
                    io.sockets.in(code).emit('serverMessage', {
                        from: 'server',
                        text: text,
                    })
                }, 1000)
            }
        });

        // when server disconnects from user
        socket.on('disconnect', () => {
            console.log('disconnected from user');
        });
    });
});

server.listen(port, () => {
    console.log(port)
    let network = os.networkInterfaces()
    if (network['Wi-Fi']) {
        network['Wi-Fi'].forEach((type) => {
            // console.log(type)
            if (type.family === 'IPv4') {
                console.log('You have connected to wifi so you can use this link for other devices on the same network >>>', type.address + ':5000')
            }
        })
    }
});
