const mongoose = require('mongoose');
const shortId = require('shortid');

const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        default: shortId.generate
    },
    name: {
        type: String,
        require: true,
        min: 5
    },
    email: {
        type: String,
        require: true,
        max:255
    },
    password: {
        type: String,
        require: true,
        min: 5,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('user', userSchema);