const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
    },
    commentPostId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    commentUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        require: true,
        maxLength: 100,
        minLength: 5
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = new mongoose.model("comments", commentSchema);