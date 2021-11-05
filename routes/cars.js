var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cars', { title: 'Search Results cars' });
});

module.exports = router;