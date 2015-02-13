var express = require('express');
var util = require('util');
var _ = require('lodash');

var router = express.Router();
var config = require('../config.json');
var dropbox = require('../dropbox/client');
var ivle = require('../ivle');
var auth = require('../auth');

var User = require('../models/user');
var IvleModule = require('../models/ivle_module');
var IvleWorkbin = require('../models/ivle_workbin');
var ObjectId = require('mongoose').Types.ObjectId;

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

// router.use(auth.authorize('nus-ivle', { failureRedirect: '/login' }));

/* GET home page. */
router.get('/', function(req, res, next) {
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

/* GET dashboard page. */
router.get('/dashboard',
  auth.authorize('nus-ivle', { failureRedirect: '/login' }),
  function(req, res) {

  res.render('dashboard', {
    title: 'Dashboard',
    modules: [{
      title: 'ACC1002X FINANCIAL ACCOUNTING',
      folders: [{title: 'Exam'}, {title: 'Lecture notes'}, {title: 'Optional Extras'}]
    }, {
      title: 'CS2102 DATABASE SYSTEM',
      folders: [{title: 'Exam'}, {title: 'Lecture notes'}, {title: 'Optional Extras'}]
    }, {
      title: 'CS3240 INTERACTION DESIGN',
      folders: [{title: 'Exam'}, {title: 'Lecture notes'}, {title: 'Optional Extras'}]
    }]
  });
});

/* GET ivle page */
router.get('/ivle', function(req, res, next){

    var token = req.query.token;

    if (!token) {
      return res.redirect('/login');
    }

    ivle.profile(token, function(err, profile){

      req.body = {
        token: token,
        profile: profile
      };

      next();
    });
  },
  auth.authenticate('nus-ivle', {failureRedirect: '/login'}),
  function(req, res) {

    return res.redirect('/dashboard');

    // Old Auth Test Code

    var token = req.query.token;

    ivle.profile(token, function(err, profile){
      console.log(err, profile);
      // AUTH
      if (!profile) {
        return res.redirect('/login');
      }

      User.findOne({ 'userId': profile.userId }, function (err, user) {
        if (user) {
          console.log('User exists');
          res.redirect('/dashboard');
          return;
        }
        var newUser = new User(profile);
        newUser.save(function (err) {
          console.log(err, newUser);
          res.redirect('/dashboard');
        });
      });

      // TEST CODE STARTS HERE

      User.findOne({ 'userId': profile.userId }, function (err, user) {
        ivle.modules(token, function(err, modules){
          // console.log(util.inspect(modules, { showHidden: true, depth: null }));
          _.each(modules, function(moduleData){
            IvleModule.findOne({ 'user': user._id, 'id': moduleData.id}, function (err, ivleModule) {
              if (ivleModule) {
                console.log('Module exists');
                return;
              }

              // Asssign User as owner of Module
              moduleData.user = user._id;

              var newModule = new IvleModule(moduleData);
              newModule.save(function (err, saved) {
                console.log(err, saved);
              });
            });
          });
        });

        var options =  {user: new ObjectId(user._id)};

        IvleModule.find(options, function(err, ivleModules){
          console.log(err, ivleModules);
          _.each(ivleModules, function(ivleModule){
            console.log(ivleModule.id);
            ivle.workbins(token, ivleModule.id, function(err, ivleWorkbinsData){
              _.each(ivleWorkbinsData, function(ivleWorkbinData){
                IvleWorkbin.findOne({user: user._id, id: ivleWorkbinData.id}, function(err, ivleWorkbin){
                  if(ivleWorkbin){
                    console.log('Workbin Exists');
                    return;
                  }

                  // Asssign User as owner of Module
                  ivleWorkbinData.user = user._id;
                  ivleWorkbinData.module = ivleModule._id;

                  newIvleWorkbin = new IvleWorkbin(ivleWorkbinData);
                  newIvleWorkbin.save(function(err, saved){
                    console.log(err, saved);
                  });
                });
              });
            });
          });
        });
      });
    });
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
