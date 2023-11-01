const User = require('../models/users')
const Comments = require('../models/comments')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const fs = require('fs')
const UsersModal = require('../models/users')
const PostsModal = require('../models/post')


//@desc Get all comments
//@route GET / comments
//@access Private
const getAllCommentsOfPosts = asyncHandler(async (req, res) => {
    const { commentPostId } = req.params
    if (!commentPostId) {
        return res.status(400).json({ message: 'commentPostId is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(commentPostId)) {
        return res.status(400).json({ message: 'Wrong post Id, please check Id Once Again' })
    }
    const comments = await Comments.findOne({ commentPostId }).lean().exec()
    if (!comments) {
        return res.status(400).json({ message: 'no Comments Found' })
    }
    return res.status(200).json({ message: 'commentPostId is required' })
})

//@desc post comment
//@route Post / comment
//@access Private
const postCommentsOfPosts = async (req, res) => {

    const { email, name, commentUserId, commentPostId, title, content } = req.body
    try {

        if (!email || !name || !commentUserId || !commentPostId || !title || !content) {
            return res.status(400).json({ message: 'All fields are Required' })
        }

        // || !mongoose.Types.ObjectId.isValid(commentPostId)
        if (mongoose.Types.ObjectId.isValid(commentPostId)) {
            return res.status(400).json({ message: 'Wrong post Id and user Id, please check Id Once Again' })
        }
        if (!mongoose.Types.ObjectId.isValid(commentUserId)) {
            return res.status(400).json({ message: 'Wrong post Id and user Id, please check Id Once Again' })
        }

        const user = await UsersModal.findOne({ _id: commentUserId }).lean().exec()
        if (!user) {
            return res.status(404).json({ message: 'User Not found, please refresh page try again' })
        }

        const post = await PostsModal.findOne({ _id: commentPostId }).lean().exec()
        if (!user) {
            return res.status(404).json({ message: 'Post Not found, please refresh page try again' })
        }
        return res.status(200).json({ message: 'Posted' })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllCommentsOfPosts,
    postCommentsOfPosts
}