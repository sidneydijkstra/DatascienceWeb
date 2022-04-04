const { body,validationResult } = require('express-validator');var fs = require('fs');
var rawdata = fs.readFileSync("./json/maps.json");
var maps = JSON.parse(rawdata)

var db = require('./database/databasecontroller.js');
var database = require("./database/database.js");

exports.map_show = async function(req, res, next){
  var ping = await database.isConnected();

  if(!ping.state){
    req.session.webError = {
      function: 'mapviewcontroller.map_show()',
      protocol: req.protocol,
      from: req.originalUrl,
      error: ping.error
    }
    return res.redirect('/');
  }

  var map = null
  var currentMapId = req.session.mapId ? req.session.mapId : -1;
  if(currentMapId != -1){
    map = maps.find(x => x.id == currentMapId);
    req.session.mapId = -1

    if(map){
      var query = await db.raw(map.sql);
      if(!query.state){
        req.session.mapId = 0;
        req.session.webError = {
          function: 'mapviewcontroller.map_show()',
          protocol: req.protocol,
          from: req.originalUrl,
          error: query.error
        }
        return res.redirect('/');
      }

      map.table = query;
    }
  }

  res.render('mapview', {
    header: "map",
    currentMapId: currentMapId,
    maps: maps,
    map: map
  });
};

exports.map_get = async function(req, res, next){
  const value = validationResult(req);
  if (!value.isEmpty()){
    req.session.webError = {
      function: 'mapviewcontroller.map_get()',
      protocol: req.protocol,
      from: req.originalUrl,
      error: value.error
    }
    return res.redirect('/');
  }

  console.log(req.body)
  req.session.mapId = req.body.id;
  res.redirect('/map');
};

/*
SELECT c.country_Id, c.movie_Id, c.movieOrShowName, c.country, (SELECT ct.movieOrShowName as name FROM db_datascience.Country ct WHERE ct.movie_Id IS NOT NULL) AS cc FROM db_datascience.Country c WHERE c.movie_Id IS NOT NULL AND c.movieOrShowName LIKE cc.name LIMIT 10;
*/
