let mongoose = require('mongoose');

exports.User = mongoose.model('User', require('./UserSchema'));
