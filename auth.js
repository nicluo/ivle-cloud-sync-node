var passport = require('passport');
var NusIvleStrategy = require('./passport-nus-ivle');
var User = require('./models/user');

passport.use(new NusIvleStrategy({
    passReqToCallback: true
  }, function(req, token, profile, done) {
    // Verify Callback
    if (!req.user) {
      // Not logged in. Authenticate based on profile.userId.
      User.findOne({ 'userId': profile.userId }, function (err, user) {
        if (err) { return done(err); }

        if (!user) { return done(null, false); }

        if (user) { return done(null, user); }

        // Registration if new user
        var newUser = new User(profile);

        newUser.token = token;

        newUser.save(function (err, savedUser) {
          if (err) { return done(err); }
          return done(null, user);
        });
      });
    } else {
      // Logged in. Preserve login state.
      return done(null, req.user);
    }
  }
));

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

// Auth inherits passport
var auth = Object.create(passport);

auth.populateLocals = function(req, res, next){
    res.locals.user = req.user;
    next();
};

module.exports = auth;
