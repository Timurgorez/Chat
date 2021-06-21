var express = require("express");
var router = express.Router();

var LiveChat = require("../controllers/LiveChat");



router.get('/', LiveChat.chat);

module.exports = router;