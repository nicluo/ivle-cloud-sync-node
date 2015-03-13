var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  userId: String,
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

module.exports = User;
