// setup dotenv config for .env file usage
require('dotenv').config();

// get dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

// create routes
var indexRouter = require('./routes/index');
var tableviewRouter = require('./routes/tableview');
var rawviewRouter = require('./routes/rawview');
var questionviewRouter = require('./routes/questionview');
var mapviewRouter = require('./routes/mapview');

// setup express app
var app = express();

// set app using json
app.use(express.json());

// setup session information
app.use(session({
    secret: "a9b8c7d6tertcessectret$#%*^@!&",
    saveUninitialized: true,
    cookie: { maxAge: (1000 * 60 * 60 * 24) },
    resave: false
}));

// view engine setup, using .ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setup logger
app.use(logger('dev'));
// setup url encoding
app.use(express.urlencoded({ extended: false }));
// setup cookieparser
app.use(cookieParser());

// create public folder
app.use(express.static(path.join(__dirname, 'public')));

// setup routes
app.use('/', indexRouter);
app.use('/table', tableviewRouter);
app.use('/raw', rawviewRouter);
app.use('/question', questionviewRouter);
app.use('/map', mapviewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// export app
module.exports = app;
