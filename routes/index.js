// get express and create router
var express = require('express');
var router = express.Router();

// get database and databasecontroller
var database = require("../controllers/database/database.js")
var db = require('../controllers/database/databasecontroller.js');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  // get webError variable from session, this variable contains an error if there is any
  var currentWebError = req.session.webError ? req.session.webError : {};
  // after getting the error cleare the session variable
  req.session.webError = {};


  // ping database to get status
  var ping = await database.isConnected();
  // get database information a.k.a. status
  var status = database.getConnectionStatus();
  // set status state to ping state
  status.state = ping.state;

  // render index page
  res.render('index', {
    header: "index",
    currentWebError: currentWebError,
    database: status
  });
});

module.exports = router;
