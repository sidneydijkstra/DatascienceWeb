const { body,validationResult } = require('express-validator');
var db = require('./database/databasecontroller.js');

exports.table_show = async function(req, res, next){
  var currentSelectedTable = req.session.selectedTable ? req.session.selectedTable : "Movie";
  var currentSearchTable = req.session.searchTable ? req.session.searchTable : {};
  var currentLimitTable = req.session.limitTable ? req.session.limitTable : 25;

  var table = db.get(currentSelectedTable);
  if (!table.state){
    req.session.searchTable = {};
    req.session.webError = {
      function: 'tableviewcontroller.table_show()',
      protocol: req.protocol,
      from: req.originalUrl,
      error: table.error
    }
    return res.redirect('/');
  }

  var query = await table.result.search(currentSearchTable, currentLimitTable);
  if (!query.state){
    req.session.searchTable = {};
    req.session.webError = {
      function: 'tableviewcontroller.table_show()',
      protocol: req.protocol,
      from: req.originalUrl,
      error: query.error
    }
    return res.redirect('/');
  }

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
  const value = validationResult(req);
  if (!value.isEmpty()){
      req.session.selectedTable = "Movie";
      req.session.limitTable = 25;
      return req.session.webError = {
        function: 'tableviewcontroller.table_get()',
        protocol: req.protocol,
        from: req.originalUrl,
        error: value.error
      }
      return res.redirect('/');
  }

  req.session.selectedTable = req.body.table;
  req.session.limitTable = req.body.limit;
  req.session.searchTable = {};
  return res.redirect('/table');
};

exports.table_search = async function(req, res, next){
  const value = validationResult(req);
  if (!value.isEmpty()){
    req.session.searchTable = {};
    req.session.webError = {
      function: 'tableviewcontroller.table_search()',
      protocol: req.protocol,
      from: req.originalUrl,
      error: value.error
    }
    return res.redirect('/');
  }

  req.session.searchTable = req.body;
  res.redirect('/table');
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
