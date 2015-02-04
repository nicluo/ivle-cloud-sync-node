var mongoose = require('mongoose');

var moduleSchema = mongoose.Schema({
  id: String,
  courseCode: String,
  courseName: String,
  courseCloseDateJs: String,
  courseOpenDateJs: String,
  permission: String,
  isActive: String
});

var Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
