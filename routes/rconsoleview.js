var express = require('express');
var router = express.Router();

var rConsoleController = require('../controllers/rconsolecontroller.js');

/* '/raw' routings */
router.get('/', rConsoleController.rconsole_show);
router.post('/grconsole', rConsoleController.rconsole_get);

module.exports = router;
