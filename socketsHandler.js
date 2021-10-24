const socketIO = require("socket.io");

const { rooms } = require("./dataChat");
const server = require("./index");



module.exports.socketHandler = () => {
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

  return server
};
