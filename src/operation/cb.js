var debug = require('debug')('dmail');

exports.cb = function(next) {
  return function(err, data) {
    if (err) {
      debug('log: ' + err);
      return;
    }
    next(data);
  };
};