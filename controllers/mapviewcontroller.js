// get express-validator, body and validationResult functions
const { body,validationResult } = require('express-validator');
// get errorFactory, contains static function to create error modules
var errorFactory = require('../factories/errorfactory.js')

// get fs, used in loading files
var fs = require('fs');
// load maps.json from system
var rawdata = fs.readFileSync("./json/maps.json");
// parse loaded data to questions
var maps = JSON.parse(rawdata)

// get database and databasecontroller
var db = require('./database/databasecontroller.js');
var database = require("./database/database.js");

exports.map_show = async function(req, res, next){
  // ping database to get status
  var ping = await database.isConnected();

  // check ping status
  if(!ping.state){
    // create exception error
    var error = errorFactory.createExceptionError('mapviewcontroller.map_show()', req, ping.error);
    req.session.webError = error;

    // redirect to index
    return res.redirect('/');
  }

  // get session variable
  var currentMapId = req.session.mapId ? req.session.mapId : -1;

  // create map variable
  var map = null

  // check if a map is selected
  if(currentMapId != -1){
    // reset mapId session variable
    req.session.mapId = -1
    // find selected map
    map = maps.find(x => x.id == currentMapId);

    // if map exsits
    if(map){
      // get query result
      var query = await db.raw(map.sql);
      // check query state
      if(!query.state){
        // reset session variable on failure
        req.session.mapId = 0;

        // create exception error
        var error = errorFactory.createExceptionError('mapviewcontroller.map_show()', req, query.error);
        req.session.webError = error;

        // redirect to index
        return res.redirect('/');
      }

      // set map table to query
      map.table = query;
    }
  }

  // render mapview page
  res.render('mapview', {
    header: "map",
    currentMapId: currentMapId,
    maps: maps,
    map: map
  });
};

exports.map_get = async function(req, res, next){
  // do validation
  const value = validationResult(req);

  // check validation
  if (!value.isEmpty()){
    // create validation error
    error = errorFactory.createValidationError('map_get', req, value.errors.param, value.errors);
    req.session.webError = error

    // redirect to index
    return res.redirect('/');
  }

  // set session variable
  req.session.mapId = req.body.id;

  // redirect to table
  res.redirect('/map');
};

/*
SELECT c.country_Id, c.movie_Id, c.movieOrShowName, c.country, (SELECT ct.movieOrShowName as name FROM db_datascience.Country ct WHERE ct.movie_Id IS NOT NULL) AS cc FROM db_datascience.Country c WHERE c.movie_Id IS NOT NULL AND c.movieOrShowName LIKE cc.name LIMIT 10;
*/
