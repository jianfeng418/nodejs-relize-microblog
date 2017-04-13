var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send('the time is '+new Date().toString()+"  OK");
});

module.exports = router;
