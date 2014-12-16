var express = require('express');
var router = express.Router();
var config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/login', function(req, res) {
  res.redirect('https://ivle.nus.edu.sg/api/login/?apikey=' + config.apikey  + '&url=http://localhost:3000/ivle');
});

router.get('/ivle', function(req, res) {
  console.log(req.query.token);
  res.render('index', { title: 'Express' });
});

module.exports = router;
