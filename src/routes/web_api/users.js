var express = require('express');
var router = express.Router();
var User = require('../../operation/user');

/* GET users listing. */

router.post('/login', function(req, res, next) {
  User(req, res, next);
});

router.post('/register', function(req, res, next) {
  User(req, res, next);
});

module.exports = router;