var mysql = require('mysql');
var debug = require('debug')('dmail');
var callback = require('../operation/cb').cb;

var init = function (cb, db) {
  var options = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD
  };
  if (db) {
    options.database = db;
  }
  var con = mysql.createConnection(options);
  con.connect(callback(function () {
    debug('log:' + 'Connected!');
    cb instanceof Function && cb(con);
  }));
};
// if(!module.parent) {
// init();
// }
module.exports = init;