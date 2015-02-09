var passport = require('passport');
var NusIvleStrategy = require('./passport-nus-ivle');
var User = require('./models/user');

passport.use(new NusIvleStrategy(
  function(token, profile, done) {
    User.findOne({ 'userId': profile.userId }, function (err, user) {
      if (err) { return done(err); }

      if (!user) { return done(null, false); }

      if (user) { return done(null, user); }

      var newUser = new User(profile);

      newUser.token = token;

      newUser.save(function (err, savedUser) {
        if (err) { return done(err); }
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

module.exports = passport;
