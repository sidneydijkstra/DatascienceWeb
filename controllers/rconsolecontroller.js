// get express-validator, body and validationResult functions
const { body,validationResult } = require('express-validator');
// get errorFactory, contains static function to create error modules
var errorFactory = require('../factories/errorfactory.js')

// get database and databasecontroller
var db = require('./database/databasecontroller.js');
var database = require("./database/database.js")

// get r-script, used for running R code
var R = require('r-integration');

// get fs, used in loading files
var fs = require('fs');
// load maps.json from system
var rawdata = fs.readFileSync("./json/rfiles.json");
// parse loaded data to rScripts
var rFiles = JSON.parse(rawdata)

// for all files in folder
rFiles.forEach((file, i) => {
  file.code = fs.readFileSync(file.path, 'utf8');
});
console.log(rFiles);



exports.rconsole_show= async function(req, res, next){
  // get session variable
  var currentRCode = req.session.rCode ? req.session.rCode : "cat('hello world!');";

  var result = "None"
  try {
    //result = R.executeRScript("./rscripts/test.R");
    result = R.executeRCommand(currentRCode.replace(/\s+/g, ' ').trim());
  } catch (e) {
    result = e;
  }

  // render rconsoleview page
  res.render('rconsoleview', {
    header: "rconsole",
    rFiles: rFiles,
    rCode: currentRCode,
    rOutput: result
  });
};

exports.rconsole_get = async function(req, res, next){
  // do validation
  const value = validationResult(req);
  // check validation
  if (!value.isEmpty()){
    // no error handling because sql errors get filter and pushed to the user!
    // redirect to index
    return res.redirect('/');
  }

  // set session variable
  req.session.rCode = req.body.rcode;

  // redirect to rconsoleview
  res.redirect('/rconsole');
};
