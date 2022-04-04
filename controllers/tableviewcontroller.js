// get express-validator, body and validationResult functions
const { body,validationResult } = require('express-validator');
// get errorFactory, contains static function to create error modules
var errorFactory = require('../factories/errorfactory.js')

// get databasecontroller
var db = require('./database/databasecontroller.js');

exports.table_show = async function(req, res, next){
  // get session variables
  var currentSelectedTable = req.session.selectedTable ? req.session.selectedTable : "Movie";
  var currentSearchTable = req.session.searchTable ? req.session.searchTable : {};
  var currentLimitTable = req.session.limitTable ? req.session.limitTable : 25;

  // check table name exsits
  if(!db.getTables().includes(currentSelectedTable))
    currentSelectedTable = "Movie";

  // get table to load
  var table = db.get(currentSelectedTable);
  // check table state
  if (!table.state){
    // reset session variable on failure
    req.session.selectedTable = "Movie";

    // create exception error
    var error = errorFactory.createExceptionError('tableviewcontroller.table_show()', req, table.error);
    req.session.webError = error;

    // redirect to index
    return res.redirect('/');
  }

  // get query result
  var query = await table.result.search(currentSearchTable, currentLimitTable);
  // check query state
  if (!query.state){
    // reset session variable on failure
    req.session.searchTable = {};

    // create exception error
    var error = errorFactory.createExceptionError('tableviewcontroller.table_show()', req, query.error);
    req.session.webError = error;

    // redirect to index
    return res.redirect('/');
  }

  // render tableview page
  res.render('tableview', {
    header: "table",
    selectedTable: currentSelectedTable,
    searchTable: currentSearchTable,
    limitTable: currentLimitTable,
    tables: db.getTables(),
    table: query
  });
};

exports.table_get = async function(req, res, next){
  // do validation
  const value = validationResult(req);

  // check validation
  if (!value.isEmpty()){
      // reset session variables on validation failure
      req.session.selectedTable = "Movie";
      req.session.limitTable = 25;

      // create validation error
      error = errorFactory.createValidationError('table_get', req, value.errors.param, value.errors);
      req.session.webError = error

      // redirect to index
      return res.redirect('/');
  }

  // set session variables
  req.session.selectedTable = req.body.table;
  req.session.limitTable = req.body.limit;

  // redirect to table
  return res.redirect('/table');
};

exports.table_search = async function(req, res, next){
  // do validation
  const value = validationResult(req);

  // check validation
  if (!value.isEmpty()){
    // reset session variables on validation failure
    req.session.searchTable = {};

    // create validation error
    error = errorFactory.createValidationError('table_search', req, value.errors.param, value.errors);
    req.session.webError = error

    // redirect to index
    return res.redirect('/');
  }

  // set session variable
  req.session.searchTable = req.body;

  // redirect to table
  return res.redirect('/table');
};


/*
var budget = await business.get(100000, "");
var budgetArray = [];

budget.forEach((row, i) => {
  var key = budget[i].budget.split(' ')[0];
  var amount = parseFloat(row.budget.split(' ')[1].replace(/,/g, ''));
  if (budgetArray[key] == null)
    budgetArray[key] = [key, 0];
  budgetArray[key][1] += amount;
});
*/
