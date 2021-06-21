/**
 * Created by Tymur on 11.06.2021.
 */


const path = require('path');
const express = require('express');
const socketIO = require("socket.io");
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const routesApi = require('./routes/routesApi');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: function(origin, callback){
    console.log('CORS CHECK', origin);
    callback(null, true);
  }
};

app.use(cors(corsOptions));


if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', function (req, res) {
    res.sendfile(path.join(__dirname, '../client/build', 'index.html'));
  })
}


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


const PORT = process.env.PORT || 8080;
server.listen(PORT, (err) => console.log('Server is running!', err));