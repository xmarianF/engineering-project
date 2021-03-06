var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user.model');
var TempUser = require('../models/tempUser.model');
var configAuth = require('./auth');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================

  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'emails', 'name'] //This
    },
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {
        User.findOne({
          'facebook.id': profile.id
        }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          }
           else {

            var newUser = new User();

            newUser.local.login = profile.id;
            newUser.local.email = profile.id;
            newUser.local.password = profile.id;
            newUser.local.avatarImage = profile.id;

            newUser.facebook.id = profile.id; // set the users facebook id
            newUser.facebook.token = token; // we will save the token that facebook provides to the user
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            newUser.save(function(err) {
              if (err)
                throw err;

              return done(null, newUser);
            });
          }

        });
      });

    }));

  // =========================================================================
  // LOCAL ================================================================
  // =========================================================================

  /* LOGIN */

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {

      User.findOne({
        'local.email': email
      }, function(err, user, info) {
        if (err)
          return done(null, false, {message: "Wystąpił błąd."});
        else if (!user)
          return done(null, false, {message: "Podany użytkownik nie istnieje."});
        else if (!user.validPassword(password))
          return done(null, false, {message: "Niepoprawne hasło"});
        else
          return done(null, user);
      });
    }));

  /* REGISTER */

  passport.use('local-register', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {

      process.nextTick(function() {

        User.findOne({
          'local.email': email
        }, function(err, user) {
          if (err)
            return done(null, false, {message: "Wystąpił błąd."});
          else if (user) {
            return done(null, false, {message: "Podany użytkownik już istnieje."});
          } else {

            TempUser.findOne({
              'local.email': email
            }, function(err, user) {
              if (err)
                return done(null, false, {message: "Wystąpił błąd."});
              else if (user) {
                return done(null, false, {message: "Podany użytkownik już istnieje."});
              } else {
                var newUser = new TempUser();

                newUser.login = req.body.login;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.avatarImage = req.body.avatarImage;

                newUser.save(function(err) {
                  if (err)
                    throw err;
                  return done(null, newUser);
                });
              }
            });
          }
        });
      });
    }));
};
