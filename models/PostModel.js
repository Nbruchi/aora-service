const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description:{
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    saves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema);
