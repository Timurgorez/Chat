// const io = require("../../index");
const { rooms } = require("../dataChat");


module.exports.chat = function(req, res) {
  res.status(200).json([{name: 'Vasay', age: 24}, {name: 'Masha', age: 28}]);
};

module.exports.createRoom = function(req, res) {
  const {roomId, userName } = req.body;
  const obj = {
    'users': [],
    'messages': []
  };

  if(!rooms[roomId]){
    rooms[roomId] = obj;
  }else{
    obj.users = rooms[roomId]['users'];
    obj.messages = rooms[roomId]['messages'];
  }
  res.json(obj);
};


