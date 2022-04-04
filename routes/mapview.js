var express = require('express');
var router = express.Router();

var mapController = require('../controllers/mapviewcontroller.js');

/* '/question' routings */
router.get('/', mapController.map_show);
router.post('/mget', mapController.map_get);

module.exports = router;
