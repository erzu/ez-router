'use strict';


exports.admin = function(req, res, next) {
  if (req.user.admin)
    next()
  else
    next(new Error())
}
