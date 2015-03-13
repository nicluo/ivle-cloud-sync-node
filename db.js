var mongoose = require('mongoose');

var uri = 'mongodb://localhost:27017/ivlecloudsync';

var options = {
  server: { },
  replset: { }
};

options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };
mongoose.connect(uri, options);
