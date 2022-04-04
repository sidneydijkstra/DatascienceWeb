var express = require('express');
var router = express.Router();

var questionController = require('../controllers/questionviewcontroller.js');

/* '/question' routings */
router.get('/', questionController.question_show);
router.post('/qget', questionController.question_get);

module.exports = router;
