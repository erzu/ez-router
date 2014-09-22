'use strict';

var only = require('../../filters/only')


function findOne(req, res, next) {
  next()
}

exports.beforeFilter = {
  '*': only.admin,
  'show': findOne
}

exports.list = function(req, res, next) {
  next()
}

exports.show = function(req, res, next) {
  next()
}
