var express = require('express');
var router = express.Router();
var database = require("../controllers/database/database.js")
var db = require('../controllers/database/databasecontroller.js');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var currentWebError = req.session.webError ? req.session.webError : {};
  req.session.webError = {};

  var ping = await database.isConnected();
  var status = database.getConnectionStatus();
  status.state = ping.state;



  res.render('index', {
    header: "index",
    currentWebError: currentWebError,
    database: status
  });
});

module.exports = router;
