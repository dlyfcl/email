var express = require('express');
var router = express.Router();
var Mail = require('../../operation/mail');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var mail = new Mail(req, res, next);
  mail.readMailList();
});
router.post('/send', function(req, res, next) {
  var mail = new Mail(req, res, next);
  mail.sendMail();
});
router.post('/:id', function(req, res, next) {
  var mail = new Mail(req, res, next);
  mail.readMailContent();
});

module.exports = router;