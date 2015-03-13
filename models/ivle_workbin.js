var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ivleWorkbinSchema = mongoose.Schema({
  id: String,
  title: String,
  published: Boolean,
  badgeTool: Number,
  user: ObjectId,
  module: ObjectId
});

var IvleWorkbin = mongoose.model('IvleWorkbin', ivleWorkbinSchema);

module.exports = IvleWorkbin;
