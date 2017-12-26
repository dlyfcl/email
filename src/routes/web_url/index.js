var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: '-欢迎页面'
  });
});
router.get('/main', function(req, res) {
  res.render('main', {
    title: '-主页',
    username: req.session.user
  });
});
module.exports = router;