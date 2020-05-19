const mongoose = require('mongoose');
const shortId = require('shortid');

const postSchema = new mongoose.Schema({
    _id:{
        type: String,
        default: shortId.generate
    },
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
    },
    image: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Posts', postSchema);