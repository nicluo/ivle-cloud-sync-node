var express = require('express');
var util = require('util');
var router = express.Router();
var config = require('../config.json');
var dropbox = require('../dropbox/client');

var ivle = require('../ivle');
var User = require('../models/user');

var readline = require("readline");
var dropboxAuthUrl;
var simpleDriver = {
  authType: function() { return "code"; },
  url: function() { return ""; },
  doAuthorize: function(authUrl, stateParm, client, callback) {
    var interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    dropboxAuthUrl = authUrl;
    interface.write("Open the URL below in a browser and paste the " +
        "provided authentication code.\n" + authUrl + "\n");
    interface.question("> ", function(authCode) {
      interface.close();
      callback({code: authCode});
    });
  }
};

dropbox.client.authDriver(simpleDriver);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'IVLE Cloud Sync' });
});

/* GET faq page. */
router.get('/faq', function(req, res) {
  res.render('faq', { title: 'FAQ' });
});

/* GET quickstart page. */
router.get('/quickstart', function(req, res) {
  res.render('quickstart', { title: 'Quickstart' });
});

/* GET nextsteps page. */
router.get('/nextsteps', function(req, res) {
  res.render('nextsteps', { title: 'Quickstart' });
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.redirect(ivle.login_url);
});

/* GET ivle page */
router.get('/ivle', function(req, res) {
  console.log(req.query.token);
  var token = req.query.token;

  ivle.profile(token, function(err, profile){
    console.log(profile);

    User.findOne({ 'userId': profile.userId }, function (err, user) {
      if (user) {
        console.log('User exists');
        return;
      }
      var newUser = new User(profile);
      newUser.save(function (err) {
        console.log(err, newUser);
      });
    });
  });

  ivle.workbin(token, function(err, modules){
    console.log(util.inspect(modules, { showHidden: true, depth: null }));
  });

  ivle.modules(token, function(err, modules){
    console.log(util.inspect(modules, { showHidden: true, depth: null }));
  });

  res.render('layout', { title: 'IVLE', body: req.query.token });
});

/* GET dropbox page */
router.get('/dropbox', function(req, res) {
  dropbox.client.authenticate(function(error, client) {
    if (error) {
      // Replace with a call to your own error-handling code.
      //
      // Don't forget to return from the callback, so you don't execute the code
      // that assumes everything went well.
      res.redirect(dropboxAuthUrl);
      return dropbox.showError(error);
    }

    // Replace with a call to your own application code.
    //
    // The user authorized your app, and everything went well.
    // client is a Dropbox.Client instance that you can use to make API calls.
    client.writeFile("a.txt", "string", function(error, stat) {
      console.log(error, stat);
      return dropbox.showError(error);
    });
  });
  res.render('index', { title: 'Dropbox' });
});

module.exports = router;
