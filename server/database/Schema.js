let mongoose = require('mongoose');
const config = require('../config/default');

const connectMongoDB = () => {
    mongoose.connect(
        `mongodb://${config.mongodb.userName}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ).then(() => {
        console.log("Connected to mongodb");
    }).catch((err) => {
        console.log(err);
    });
}

connectMongoDB();

exports.User = mongoose.model('User', require('./UserSchema'));
