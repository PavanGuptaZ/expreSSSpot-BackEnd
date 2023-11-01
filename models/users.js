const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    following: {
        type: Array,
        default: [],
    },
    followingBy: {
        type: Array,
        default: [],
    },
    blockedUsers: {
        type: Array,
        default: [],
    },
    blockedBy: {
        type: Array,
        default: [],
    },
    likedPost: {
        type: Array,
        default: [],
    },
    bookmark: {
        type: Array,
        default: [],
    }
}, { timestamps: true })

module.exports = new mongoose.model("users", userSchema);