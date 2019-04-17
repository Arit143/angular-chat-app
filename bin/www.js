#!/usr/bin/env node

const app = require('express')();
const merge = require('lodash/merge');
const findIndex = require('lodash/findIndex');
const includes = require('lodash/includes');

/**
 * Allow requests from localhost:8080
 */
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:8080');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

const http = require('http').Server(app);
const io = require('socket.io')(http);

let allUsers = [];
let allChatRooms = [];

io.sockets.on('connection', (socket) => {
    console.log('socket connected');

    /**
     * Client emits `join`
     * Server emits `new user joined`
     * with user, message, room, allUsers and allChatRooms
     */
    socket.on('join', (data) => {
        socket.join(data.room);
        
        allUsers.push({ user: data.user, room: data.room, timeJoined: new Date() });
        !includes(allChatRooms, data.room) && allChatRooms.push(data.room);

        console.log(`${data.user} joined the room ${data.room}`);
        console.log(`All users in the room`, allUsers);

        io.in(data.room).emit('new user joined', { 
            user: data.user, 
            message: 'has joined the room', 
            room: data.room, 
            allUsers,
            allChatRooms
         });
    });

    /**
     * Client emits `new message`
     * Server emits `new message received`
     * with user, message, room and allUsers in the chat app
     */
    socket.on('new message', (data) => {
        console.log(`${data.user} in room ${data.room} has posted this message ${data.message}`);

        const userDetailIndex = findIndex(allUsers, { user: data.user, room: data.room });
        const updatedUserDetails = merge({}, allUsers[userDetailIndex], { timeMessaged: new Date() });

        allUsers[userDetailIndex] = updatedUserDetails;

        io.in(data.room).emit('new message received', { 
            user: data.user, 
            message: data.message, 
            room: data.room, 
            allUsers 
        });
    });

    /**
     * client emits `user inactivity`
     * Server emits `user inactive`
     * with user, message, room, allUsers and allChatRooms
     */
    socket.on('user inactivity', (data) => {
        console.log(`${data.user} is inactive in ${data.room}`);

        allUsers = allUsers.filter(userDetails => userDetails.user !== data.user && userDetails.room === data.room);
        
        allChatRooms.forEach(room => {
            io.in(room).emit('user inactive', { 
                user: data.user, 
                message: 'has been inactive', 
                room: room, 
                allUsers, 
                allChatRooms 
            });
        });      
    });

    /**
     * client emits `join single chat`
     * Server emits `single chat initiated`
     * with room and allChatRooms
     */
    socket.on('join single chat', (data) => {
        console.log('single chat', data.room);
        socket.join(data.room);

        !includes(allChatRooms, data.room) && allChatRooms.push(data.room);

        allChatRooms.forEach(room => {
            io.in(room).emit('single chat initiated', { room: room, allChatRooms });
        })
    });

    /**
     * handle socket disconnect
     */
    socket.on('disconnect', () => {
        allUsers = [];
        allChatRooms = [];
        console.log('socket disconnected');
    });
});

/**
 * port to listen for the server
 */
http.listen(3000, () => {
    console.log('Node server started at port 3000');
});