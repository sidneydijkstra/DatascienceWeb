const { body,validationResult } = require('express-validator');
var fs = require('fs');
var rawdata = fs.readFileSync("./json/questions.json");
var questions = JSON.parse(rawdata)

var db = require('./database/databasecontroller.js');

exports.question_show = async function(req, res, next){
  var id = -1

  if(req.session.questionId){
    //req.session.questionTables = undefined;
    id = req.session.questionId;
    req.session.questionId = undefined;
    var question = questions.find(x => x.id == id);
    var query = await db.raw(question.sql);

    if(!query.state){
      req.session.webError = {
        function: 'questionviewcontroller.question_show()',
        protocol: req.protocol,
        from: req.originalUrl,
        error: query.error
      }
      return res.redirect('/');
    }

    if(!req.session.questionTables)
      req.session.questionTables = []

    req.session.questionTables[`${id}`] = query
  }

  console.log(req.session.questionTables);

  res.render('questionview', {
    header: "question",
    questions: questions,
    questionTables: req.session.questionTables,
    currentQuestion: id
  });
};

exports.question_get = async function(req, res, next){
  const value = validationResult(req);
  if (!value.isEmpty()){
    req.session.webError = {
      function: 'questionviewcontroller.question_get()',
      protocol: req.protocol,
      from: req.originalUrl,
      error: value.error
    }
    return res.redirect('/');
  }

  var id = req.body.id;
  if(questions.find(x => x.id == id))
    req.session.questionId = id;
  res.redirect('/question');
};

/*
SELECT c.country_Id, c.movie_Id, c.movieOrShowName, c.country, (SELECT ct.movieOrShowName as name FROM db_datascience.Country ct WHERE ct.movie_Id IS NOT NULL) AS cc FROM db_datascience.Country c WHERE c.movie_Id IS NOT NULL AND c.movieOrShowName LIKE cc.name LIMIT 10;
*/
