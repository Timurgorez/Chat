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
const routesPages = require('./routes/routesPages');
const { rooms } = require("./dataChat");

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
  console.log('production', process.env);
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', function (req, res) {
    res.sendfile(path.join(__dirname, 'client/build', 'index.html'));
  })
}


const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', socket => {

  socket.on('ROOM:INIT_RUN', roomId => {
    socket.emit('ROOM:INIT_GET', rooms[roomId] ? rooms[roomId] : null);
  });

  socket.on('ROOM:JOIN', ({roomId, userName}) => {
    socket.join(roomId);
    const obj = {
      userName,
      approved: false,
      socketId: socket.id,
      online: true
    };
    if(rooms[roomId]['users'].some(e => e.userName === userName)){
      rooms[roomId]['users'].forEach(el => {
        if(el.userName === userName) el.online = true;
      })
    }else{
      rooms[roomId]['users'].push(obj);
    }
    const users = rooms[roomId]['users'];
    socket.to(roomId).broadcast.emit('ROOM:JOINED', { "newUser": userName, users });
  });

  socket.on('ROOM:NEW_MESSAGE', (msg) => {
    rooms[msg.roomId]['messages'].push(msg);
    socket.to(msg.roomId).broadcast.emit('ROOM:NEW_MESSAGE', msg);
  });

  socket.on('disconnect', () => {

    for(let roomId in rooms) {
      rooms[roomId]['users'].forEach((el, index) => {
        if(el.socketId === socket.id){
          const userName = el.userName;
          el.online = false;
          console.log('disconnected', el);
          const users = rooms[roomId]['users'];
          socket.to(roomId).broadcast.emit('ROOM:LEAVE', { "leaveUser": userName, users });
        }
      });
    }
  });

});

app.use("/api", routesApi);
app.use("/", routesPages);


const PORT = process.env.PORT || 8080;
server.listen(PORT, (err) => console.log('Server is running!', err));

