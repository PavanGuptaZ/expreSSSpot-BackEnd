const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    commentPostId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    commentUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    commentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = new mongoose.model("comments", commentSchema);