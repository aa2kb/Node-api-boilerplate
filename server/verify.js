var User = require('../users/user.model');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./../config/config');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600
  });
};

exports.user = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req._user = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};

exports.admin = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req._user = decoded;

        // check if the user has admin flag true
        if (req._user.admin) {
          next();
        } else {
          res.status(403).json({
            "message": "You are not authorized to perform this operation!"
          });
        }
      }
    });
  } else {
    // if there is no token
    // return an error
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }



};