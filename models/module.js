var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var moduleSchema = mongoose.Schema({
  id: String,
  courseCode: String,
  courseName: String,
  courseCloseDateJs: String,
  courseOpenDateJs: String,
  permission: String,
  isActive: String,
  user: ObjectId
});

var Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
