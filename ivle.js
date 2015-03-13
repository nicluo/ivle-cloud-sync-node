var config = require('./config.json');
var request = require('request');
var _ = require('lodash');

var login_url = 'https://ivle.nus.edu.sg/api/login/?apikey=' + config.apikey  + '&url=http://localhost:3000/ivle';

var profile = function profile(token, callback) {
  var url = 'https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View?APIKey=' + config.apikey + '&AuthToken=' + token;

  _request(url, callback, singular=true);
};

var modules = function modules(token, callback){
  var url = 'https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Student?APIKey=' + config.apikey + '&AuthToken=' + token + '&Duration=0&IncludeAllInfo=false';

  _request(url, callback);
};

var workbins = function workbins(token, courseId, callback){
  var url = 'https://ivle.nus.edu.sg/api/Lapi.svc/Workbins?APIKey=' + config.apikey + '&AuthToken=' + token + '&CourseID=' + courseId + '&Duration=0';

  _request(url, callback);
};

var _request = function _request(url, callback, singular){
  request(url, function(error, response, body) {
    var jsonBody = JSON.parse(body);

    var results = _camelCaseDeep(jsonBody.Results);

    if(singular){
      return callback(error, results[0]);
    }

    callback(error, results);
  });
};

// camelCase keys returned from IVLE Api
var _camelCaseDeep = function _camelCaseDeep(body) {
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
    return [_.camelCase(pair[0]), _camelCaseDeep(value)];
  }).object().value();
};

var _camelCaseArray = function _camelCaseArray(arr) {
  return _(arr).map(function(value) {
    return _camelCaseDeep(value);
  }).value();
};

module.exports = {
  login_url : login_url,
  profile : profile,
  modules : modules,
  workbins : workbins
};
