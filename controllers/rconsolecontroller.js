// get express-validator, body and validationResult functions
const { body,validationResult } = require('express-validator');
// get errorFactory, contains static function to create error modules
var errorFactory = require('../factories/errorfactory.js')

// get database and databasecontroller
var db = require('./database/databasecontroller.js');
var database = require("./database/database.js")

var fs = require('fs');
var rFiles = [];
fs.readdir('./rscripts', (err, files) => {
  files.forEach(file => {
    rFiles[file] = {
      name: file,
      path: `./rscripts/${file}`,
      output: 0
    }
  });
});

// get r-script, used for running R code
var R = require('r-integration');

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
    rcode: currentRCode,
    routput: result
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
