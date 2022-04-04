// get express-validator, body and validationResult functions
const { body,validationResult } = require('express-validator');
// get errorFactory, contains static function to create error modules
var errorFactory = require('../factories/errorfactory.js')

// get fs, used in loading files
var fs = require('fs');
// load question.json from system
var rawdata = fs.readFileSync("./json/questions.json");
// parse loaded data to questions
var questions = JSON.parse(rawdata)

// get databasecontroller
var db = require('./database/databasecontroller.js');

exports.question_show = async function(req, res, next){
  // create id variable
  var id = -1

  // check if questionId exsists in session
  if(req.session.questionId){
    //req.session.questionTables = undefined;
    // set id to questionId
    id = req.session.questionId;

    // reset questionId session variable
    req.session.questionId = undefined;

    // find question with questionId in question list
    var question = questions.find(x => x.id == id);

    // if question exists
    if (question){
      // get query result
      var query = await db.raw(question.sql);
      // check query state
      if(!query.state){
        // create exception error
        var error = errorFactory.createExceptionError('questionviewcontroller.question_show()', req, query.error);
        req.session.webError = error;

        // redirect to index
        return res.redirect('/');
      }

      // check if questionTables exists else create questionTables
      // this variable is used as a cashe for the query results
      if(!req.session.questionTables)
        req.session.questionTables = []

      // set cashe variable with id to query
      req.session.questionTables[`${id}`] = query
    }
  }

  // render questionview page
  res.render('questionview', {
    header: "question",
    questions: questions,
    questionTables: req.session.questionTables,
    currentQuestion: id
  });
};

exports.question_get = async function(req, res, next){
  // do validation
  const value = validationResult(req);

  // check validation
  if (!value.isEmpty()){
    // create validation error
    error = errorFactory.createValidationError('question_get', req, value.errors.param, value.errors);
    req.session.webError = error

    console.log(req);

    // redirect to index
    return res.redirect('/');
  }

  // get id from body
  var id = req.body.id;

  // find id in question list
  if(questions.find(x => x.id == id)){
    // set new id in session
    req.session.questionId = id;
  }

  // redirect to question
  res.redirect('/question');
};

/*
SELECT c.country_Id, c.movie_Id, c.movieOrShowName, c.country, (SELECT ct.movieOrShowName as name FROM db_datascience.Country ct WHERE ct.movie_Id IS NOT NULL) AS cc FROM db_datascience.Country c WHERE c.movie_Id IS NOT NULL AND c.movieOrShowName LIKE cc.name LIMIT 10;
*/
