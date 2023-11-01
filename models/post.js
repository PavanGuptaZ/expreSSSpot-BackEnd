const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        require: true,
        maxLength: 100,
        minLength: 5
    },
    text: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "blog.png",
    },
    likedBy: {
        type: Array,
        default: [],
    },
    reportBy: {
        type: Array,
        default: [],
    },
}, { timestamps: true })

module.exports = new mongoose.model("posts", postSchema);