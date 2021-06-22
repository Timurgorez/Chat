const express = require("express");
const {createRoom} = require("../controllers/LiveChat");
const router = express.Router();


router.get('/', function (req, res) {
  res.json({"data": 'some data here ROUTER PAGE'});
});

router.post('/rooms', createRoom);


module.exports = router;