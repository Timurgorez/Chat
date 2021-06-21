/**
 * Created by Tymur on 11.06.2021.
 */


const routesApi = require('./routes/routesApi');


const express = require('express');
const socketIO = require("socket.io");
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use("/api", routesApi);

const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});


const rooms = new Map();

app.post('/rooms', (req, res) => {
  const {roomId, userName } = req.body;
  const obj = {
    'users': [],
    'messages': []
  };

  if(!rooms.has(roomId)){
    rooms.set(roomId, new Map([
      ['users', {}],
      ['messages', []]
    ]));
  }else{
    obj.users = [rooms.get(roomId).get('users')];
    obj.messages = rooms.get(roomId)['messages'];
  }
  res.json(obj);
});


io.on('connection', socket => {
  console.log('connected', socket.id);

  socket.on('ROOM:INIT_RUN', roomId => {
    console.log(rooms.get(roomId));
    socket.emit('ROOM:INIT_GET', rooms.get(roomId) ? Object.fromEntries(rooms.get(roomId).entries()) : null);
  });


  socket.on('ROOM:JOIN', ({roomId, userName}) => {
    console.log('ROOM:JOIN', roomId, userName, rooms.get(roomId).get('users'));
    socket.join(roomId);
    const obj = {};
    obj[socket.id] = userName;
    rooms.get(roomId).set('users', {...rooms.get(roomId).get('users'), ...obj});
    const users = rooms.get(roomId).get('users');

    socket.to(roomId).broadcast.emit('ROOM:JOINED', { "newUser": userName, users });
  });

  socket.on('ROOM:NEW_MESSAGE', (msg) => {
    rooms.get(msg.roomId).get('messages').push(msg);
    socket.to(msg.roomId).broadcast.emit('ROOM:NEW_MESSAGE', msg);
  });

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);
    rooms.forEach((value, roomId) => {
      const userName = value.get('users')[socket.id];
      if(delete value.get('users')[socket.id]){
        const users = value.get('users');
        console.log(userName, users);
        socket.to(roomId).broadcast.emit('ROOM:LEAVE', { "leaveUser": userName, users });
      }
    })
  });

});



server.listen(5000, (err) => console.log('Server is running!', err));