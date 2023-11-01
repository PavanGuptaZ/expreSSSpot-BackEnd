const User = require('../models/users')
const Post = require('../models/post')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const fs = require('fs')

//@desc Get all users
//@route GET / users
//@access Private
const getAllPosts = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await Post.find({ userId: _id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.json(posts)
})
const getSpecificPostById = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Wrong post Id, please check Id Once Again' })
    }
    const posts = await Post.findOne({ _id: id })
    if (!posts) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.json(posts)
})

//@desc Get all liked by users
//@route GET / users
//@access Private
const getAllLikedByUsers = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await Post.find({ userId: _id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.json(posts)
})

//@desc Get all liked by users
//@route GET / users
//@access Private
const getAllCommentedByUsers = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await Post.find({ userId: _id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.json(posts)
})

//@desc Get all liked by users
//@route GET / users
//@access Private
const getAllBookmarkedByUsers = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await Post.find({ userId: _id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.json(posts)
})

//@desc Create all users
//@route POST / users
//@access Private
const createNewPost = asyncHandler(async (req, res) => {

    const { email, name, userId, title, text, image } = req.body

    if (!email || !name || !userId || !title || !text || !image) {
        return res.status(400).json({ message: 'All fields are Required' })
    }

    const duplicate = await Post.findOne({ userId, title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Title From You' })
    }

    const userPost = { ...req.body }

    const post = await Post.create(userPost)
    console.log(post)
    if (post) {
        res.status(200).json({ post: post, message: `New Post ${title} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }
})

//@desc update a users
//@route PATCH / users
//@access Private
const updatePost = asyncHandler(async (req, res) => {
    const { _id, email, password, name, following, followingBy, blockedUsers, blockedBy } = req.body

    if (!_id || !email || !password) {
        return res.status(400).json({ message: 'All fields are' })
    }
    const user = await User.findOne({ email }).lean().exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ email }).lean().exec()

})

//@desc delete a users
//@route DELETE / users
//@access Private
const deletePost = asyncHandler(async (req, res) => {
    const { _id, userId } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Post ID required' })
    }

    const post = await Post.findOne({ _id })
    if (!post) {
        return res.status(400).json({ message: 'No Post in this Id' })
    }

    if (req.user._id === userId) {
        await Post.deleteOne({ _id })

        if (post.image !== 'blog.png') {
            fs.unlink(`./public/images/${post.image}`, (err) => err && console.log(err))
        }
        return res.status(200).json({ message: `${post.title} post is Deleted` })
    } else {
        return res.status(401).json({ message: 'Only user has Rights to Delete Post' })
    }

})

module.exports = {
    getAllPosts,
    getSpecificPostById,
    getAllLikedByUsers,
    getAllCommentedByUsers,
    getAllBookmarkedByUsers,
    createNewPost,
    updatePost,
    deletePost
}