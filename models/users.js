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
        default: "ExpressEnthusiast",
        require: true
    },
    description: {
        type: String,
        default: "Passionate about all things express - news, opinions, and updates. Join me in exploring the world of expediency at expreSSSpot!",
        require: true,
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
    likedPosts: {
        type: Array,
        default: [],
    },
    bookmarks: {
        type: Array,
        default: [],
    },
    profilePic: {
        type: String,
        default: "profile_pic.png"
    }
}, { timestamps: true })

module.exports = new mongoose.model("users", userSchema);