var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var index = require('./routes/web_url/index');
var user = require('./routes/web_url/user');
var mail = require('./routes/web_url/mail');
var users = require('./routes/web_api/users');
var mails = require('./routes/web_api/mails');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(cookieParser());
app.use(session({
  secret: 'sosos'
}));
app.use(express.static(path.join(__dirname, 'public')));

//url
app.use('/', index);
app.use('/user', user);
app.use('/mail', mail);
//api
app.use('/users', users);
app.use('/mails', mails);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function(err, req, res) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;