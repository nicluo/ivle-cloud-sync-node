var express = require('express');
var router = express.Router();
var config = require('../config.json');
var dropbox = require('../dropbox/client');

var ivle = require('../ivle');

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

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ivlecloudsync');

var userSchema = mongoose.Schema({
  userID: String,
  name: String,
  email: String,
  gender: String,
  faculty: String,
  firstMajor: String,
  secondMajor: String,
  matriculationYear: String,
  token: String
});

var User = mongoose.model('User', userSchema);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'IVLE Cloud Sync' });
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
    var user = new User(profile);
    user.save(function (err) {
      console.log(err, user);
    });
  });

  /* ivle.modules(token, function(err, modules){
    console.log(modules);
  }); */

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
