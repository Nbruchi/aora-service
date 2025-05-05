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
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema);
