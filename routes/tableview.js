var express = require('express');
var router = express.Router();

var tableController = require('../controllers/tableviewcontroller.js');

/* '/table' routings */
router.get('/', tableController.table_show);
router.post('/gtable', tableController.table_get);
router.post('/stable', tableController.table_search);

module.exports = router;
