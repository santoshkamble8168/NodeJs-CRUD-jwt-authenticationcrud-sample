const mongoose = require('mongoose');
const config = require('../settings/config');

const url = `mongodb://${config.database.host}:${config.database.port}/${config.database.db}`;

//Database connection
mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology:true},
    () => { console.log('MongoDB connected')}
);

module.exports.User = require('./User');
module.exports.Posts = require('./posts');