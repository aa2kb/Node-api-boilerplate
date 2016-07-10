var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../users/user.model');
var config = require('../config/config');

//Setup Local Login Strategy
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());