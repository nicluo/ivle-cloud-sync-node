var config = require('./config.json');
var request = require('request');

var login_url = 'https://ivle.nus.edu.sg/api/login/?apikey=' + config.apikey  + '&url=http://localhost:3000/ivle';

var profile = function profile(token, callback) {
  var url = 'https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View?APIKey=' + config.apikey + '&AuthToken=' + token;
  _request(url, callback, singular=true);
};

var modules = function modules(token, callback){
  var url = 'https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Student?APIKey=' + config.apikey + '&AuthToken=' + token + '&Duration=0&IncludeAllInfo=true';
  _request(url, callback);
};

var _request = function _request(url, callback, singular){
  request(url, function(error, response, body) {
    var jsonBody = JSON.parse(body);
    if(singular){
      return callback(error, jsonBody.Results[0]);
    }
    callback(error, jsonBody.Results);
  });
};

module.exports = {
  login_url : login_url,
  profile : profile,
  modules : modules
};
