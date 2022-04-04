var express = require('express');
var router = express.Router();

var rawController = require('../controllers/rawviewcontroller.js');

/* '/raw' routings */
router.get('/', rawController.raw_show);
router.post('/graw', rawController.raw_get);

module.exports = router;
