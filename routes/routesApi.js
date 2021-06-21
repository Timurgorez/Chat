var express = require("express");
var router = express.Router();

var LiveChat = require("../controllers/LiveChat");



router.get('/', LiveChat.chat);
router.get('/test', function (req, res) {
  res.json({"data": 'some data here'});
});

module.exports = router;