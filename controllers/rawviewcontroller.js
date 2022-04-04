const { body,validationResult } = require('express-validator');
var db = require('./database/databasecontroller.js');
var database = require("./database/database.js")

exports.raw_show = async function(req, res, next){
  var ping = await database.isConnected();

  if(!ping.state){
    req.session.sqlRaw = `SELECT * FROM db_datascience.Movie LIMIT 10;`;
    req.session.webError = {
      function: 'rawviewcontroller.raw_show()',
      protocol: req.protocol,
      from: req.originalUrl,
      error: ping.error
    }
    return res.redirect('/');
  }

  var sqlRaw = req.session.sqlRaw ? req.session.sqlRaw : `SELECT * FROM db_datascience.Movie LIMIT 10;`;
  var query = await db.raw(sqlRaw);

  res.render('rawview', {
    header: "raw",
    lastSql: sqlRaw,
    lastError: query.error,
    table: query
  });
};

exports.raw_get = async function(req, res, next){
  const value = validationResult(req);
  if (!value.isEmpty()){
    req.session.webError = {
      function: 'rawviewcontroller.raw_get()',
      protocol: req.protocol,
      from: req.originalUrl,
      error: value.error
    }
    return res.redirect('/');
  }

  req.session.sqlRaw = req.body.sql;
  res.redirect('/raw');
};

/*
SELECT c.country_Id, c.movie_Id, c.movieOrShowName, c.country, (SELECT ct.movieOrShowName as name FROM db_datascience.Country ct WHERE ct.movie_Id IS NOT NULL) AS cc FROM db_datascience.Country c WHERE c.movie_Id IS NOT NULL AND c.movieOrShowName LIKE cc.name LIMIT 10;
*/
