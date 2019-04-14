#!/usr/bin/env node

const app = require('express')();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:8080');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.sockets.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('join', (data) => {
        socket.join(data.room);

        console.log(`${data.user} joined the room ${data.room}`);

        io.in(data.room).emit('new user joined', { user: data.user, message: 'has joined the room', room: data.room });
    });

    socket.on('new message', (data) => {
        console.log(`${data.user} in room ${data.room} has posted this message ${data.message}`);
        io.in(data.room).emit('new message received', { user: data.user, message: data.message, room: data.room });
    })

    socket.on('user inactivity', (data) => {
        console.log(`${data.user} is inactive`);
        io.in(data.room).emit('user inactive', { user: data.user, message: 'has been inactive', room: data.room });
    })

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
});

http.listen(3000, () => {
    console.log('Node server started at port 3000');
});