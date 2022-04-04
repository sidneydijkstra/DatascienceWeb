// get express-validator, body and validationResult functions
const { body,validationResult } = require('express-validator');
// get errorFactory, contains static function to create error modules
var errorFactory = require('../factories/errorfactory.js')

// get database and databasecontroller
var db = require('./database/databasecontroller.js');
var database = require("./database/database.js")

exports.raw_show = async function(req, res, next){
  // ping database to get status
  var ping = await database.isConnected();

  // check ping status
  if(!ping.state){
    // reset session variable
    req.session.sqlRaw = `SELECT * FROM db_datascience.Movie LIMIT 10;`;

    // create exception error
    var error = errorFactory.createExceptionError('rawviewcontroller.raw_show()', req, ping.error);
    req.session.webError = error;

    // redirect to index
    return res.redirect('/');
  }

  // get session variable
  var sqlRaw = req.session.sqlRaw ? req.session.sqlRaw : `SELECT * FROM db_datascience.Movie LIMIT 10;`;

  // get query result
  var query = await db.raw(sqlRaw);

  // render rawview page
  res.render('rawview', {
    header: "raw",
    lastSql: sqlRaw,
    lastError: query.error,
    table: query
  });
};

exports.raw_get = async function(req, res, next){
  // do validation
  const value = validationResult(req);
  // check validation
  if (!value.isEmpty()){
    // no error handling because sql errors get filter and pushed to the user!
    // redirect to index
    return res.redirect('/');
  }

  // set session variable
  req.session.sqlRaw = req.body.sql;

  // redirect to raw
  res.redirect('/raw');
};
