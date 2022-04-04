const { check } = require('express-validator');
var express = require('express');
var router = express.Router();

var mapController = require('../controllers/mapviewcontroller.js');

/* '/question' routings */
router.get('/', mapController.map_show);
router.post('/mget', [
  check('id').exists().isInt()
], mapController.map_get);

module.exports = router;
