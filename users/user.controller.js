var User = require('./user.model');
var passport = require('passport');
var Verify = require('../server/verify.js');
var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;

exports.listAll = function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) throw err;
    res.json(users);
  });
};

exports.register = function(req,res){
  User.register(new User({
      username: req.body.username
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save(function (err, user) {
        passport.authenticate('local')(req, res, function () {
          return res.status(200).json({
            message: 'User registered',
            success: true,
            data : null
          });
        });
      });
    });
};

exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          message: 'Could not log in user',
          success: true,
          data : null
        });
      }

      var token = Verify.getToken(user);
      res.status(200).json({
        message: 'Login successful!',
        success: true,
        data: {token : token}
      });
    });
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  res.status(200).json({
    message: 'logout',
    success: true,
    data : null
  });
};