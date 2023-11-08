const UserModal = require('../models/users')
const PostModal = require('../models/post')
const CommentModal = require('../models/comments')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const fs = require('fs')

//@desc Get all users
//@route GET / users
//@access Private
const getAllPosts = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await PostModal.find({ userId: _id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

const getAllPostOfUsers = asyncHandler(async (req, res) => {
    let { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Wrong user Id, please check Id Once Again' })
    }

    const user = await UserModal.findOne({ _id: id }).lean()
    if (!user) {
        return res.status(404).json({ message: 'User not Found' })
    }

    const posts = await PostModal.find({ userId: id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

const getSpecificPostById = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Wrong post Id, please check Id Once Again' })
    }
    const post = await PostModal.findOne({ _id: id }).lean()
    if (!post) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    let { userId } = post
    let user = await UserModal.findOne({ _id: userId })
    if (!user) {
        return res.status(404).json({ message: 'Associated User Not Found' });
    }

    res.status(200).json({ ...post, name: user.name })
})

//@desc Get all liked by users
//@route GET / users
//@access Private
const getAllLikedByUsers = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await PostModal.find({ userId: _id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

//@desc Get all liked by users
//@route GET / users
//@access Private
const getAllCommentedByUsers = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await PostModal.find({ userId: _id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

//@desc Get all liked by users
//@route GET / users
//@access Private
const getAllBookmarkedByUsers = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await PostModal.find({ userId: _id })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

//@desc Create all users
//@route POST / users
//@access Private
const createNewPost = asyncHandler(async (req, res) => {
    let { _id } = req.user

    const { email, userId, title, text, image } = req.body

    if (!email || !userId || !title || !text || !image) {
        return res.status(400).json({ message: 'All fields are Required' })
    }

    if (String(_id) != String(userId)) {
        return res.status(401).json({ message: 'User Error' })
    }

    const duplicate = await PostModal.findOne({ userId, title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Title From You' })
    }

    const userPost = { email, userId, title, text, image }

    const post = await PostModal.create(userPost)
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
    const user = await UserModal.findOne({ email }).lean().exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await UserModal.findOne({ email }).lean().exec()

})

//@desc delete a users
//@route DELETE / users
//@access Private
const deletePost = asyncHandler(async (req, res) => {
    const { _id, userId } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Post ID required' })
    }

    const post = await PostModal.findOne({ _id })
    if (!post) {
        return res.status(400).json({ message: 'No Post in this Id' })
    }

    if (req.user._id === userId) {
        await PostModal.deleteOne({ _id })
        await CommentModal.deleteMany({ commentPostId: _id })

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
    getAllPostOfUsers,
    getSpecificPostById,
    getAllLikedByUsers,
    getAllCommentedByUsers,
    getAllBookmarkedByUsers,
    createNewPost,
    updatePost,
    deletePost
}