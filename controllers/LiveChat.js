// const io = require("../../index");

module.exports.chat = function(req, res) {
  res.status(200).json([{name: 'Vasay', age: 24}, {name: 'Masha', age: 28}]);
}