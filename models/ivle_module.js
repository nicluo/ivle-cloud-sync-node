var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ivleModuleSchema = mongoose.Schema({
  id: String,
  courseCode: String,
  courseName: String,
  courseCloseDateJs: String,
  courseOpenDateJs: String,
  permission: String,
  isActive: String,
  user: ObjectId
});

var IvleModule = mongoose.model('IvleModule', ivleModuleSchema);

module.exports = IvleModule;
