'use strict';

var only = require('../../filters/only')


exports.beforeFilter = {
  '*': only.admin
}

exports.list = function(req, res, next) {
  next()
}
