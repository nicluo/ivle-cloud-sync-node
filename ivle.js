var config = require('./config.json');
var request = require('request');
var _ = require('lodash');

var login_url = 'https://ivle.nus.edu.sg/api/login/?apikey=' + config.apikey  + '&url=http://localhost:3000/ivle';

var profile = function profile(token, callback) {
  var url = 'https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View?APIKey=' + config.apikey + '&AuthToken=' + token;

  _request(url, function(err, body){
    var profile = _camelCaseObject(body);

    callback(err, profile);
  }, singular=true);
};

var modules = function modules(token, callback){
  var url = 'https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Student?APIKey=' + config.apikey + '&AuthToken=' + token + '&Duration=0&IncludeAllInfo=true';

  _request(url, function(err, body){
    var mods = _camelCaseObjectOrArray(body);

    callback(err, mods);
  });
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

// camelCase keys returned from IVLE Api
var _camelCaseObjectOrArray = function _camelCaseObjectOrArray(body) {
  if (_.isArray(body))
    return _camelCaseArray(body);
  else if (_.isPlainObject(body))
    return _camelCaseObject(body);
  else
    return body;
};

var _camelCaseObject = function _camelCaseObject(obj){
  return _(obj).pairs().map(function(pair){
    var value = pair[1];
    if (_.isArray(value))
      value = _camelCaseArray(value);
    else if (_.isPlainObject(value))
      value = _camelCaseObject(value);
    return [_.camelCase(pair[0]), value];
  }).object().value();
};

var _camelCaseArray = function _camelCaseArray(arr) {
  return _(arr).map(function(value) {
    if (_.isArray(value))
      return _camelCaseArray(value);
    else if (_.isPlainObject(value))
      return _camelCaseObject(value);
    else return value;
  }).value();
};

module.exports = {
  login_url : login_url,
  profile : profile,
  modules : modules
};
