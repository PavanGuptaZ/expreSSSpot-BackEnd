const UserModal = require('../models/users')
const PostModal = require('../models/post')
const CommentModal = require('../models/comments')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const fs = require('fs')

//@desc Get all posts users
//@route GET / posts
//@access Private
const getAllPosts = asyncHandler(async (req, res) => {
    let { _id } = req.user
    const posts = await PostModal.find({ userId: _id }).sort({ createdAt: -1 })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

//@desc Get all posts of a users
//@route GET / posts
//@access Private
const getAllPostOfUsers = asyncHandler(async (req, res) => {
    let { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Wrong user Id, please check Id Once Again' })
    }

    const user = await UserModal.findOne({ _id: id }).lean()
    if (!user) {
        return res.status(404).json({ message: 'User not Found' })
    }

    const posts = await PostModal.find({ userId: id }).sort({ createdAt: -1 })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

//@desc Get a post
//@route GET / posts
//@access Private
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

//@desc Get all liked by user
//@route GET / posts
//@access Private
const getAllLikedByUsers = asyncHandler(async (req, res) => {
    let { likedPosts } = req.user

    const posts = await PostModal.find({ _id: { $in: likedPosts } }).sort({ createdAt: -1 })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

//@desc Get all commented posts by user
//@route GET / posts
//@access Private
const getAllCommentedByUsers = asyncHandler(async (req, res) => {
    let { _id } = req.user

    const postsIds = await CommentModal.find({ commentUserId: _id }).select({ commentPostId: 1, _id: 0 }).lean()
    const postIdsArray = postsIds.map(item => item.commentPostId)

    const posts = await PostModal.find({ _id: { $in: postIdsArray } }).sort({ createdAt: -1 })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

//@desc Get all liked by users
//@route GET / posts
//@access Private
const getAllBookmarkedByUsers = asyncHandler(async (req, res) => {
    let { bookmarks } = req.user

    const posts = await PostModal.find({ _id: { $in: bookmarks } }).sort({ createdAt: -1 })
    if (!posts?.length) {
        return res.status(400).json({ message: 'No Post Found' })
    }
    res.status(200).json(posts)
})

//@desc Create new post
//@route POST / posts
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

    if (post) {
        res.status(200).json({ post: post, message: `New Post ${title} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }
})

//                                  ****incompleted****
//@desc update a post
//@route PATCH / posts
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

//@desc update like for a post
//@route PATCH / posts
//@access Private
const likePost = asyncHandler(async (req, res) => {
    let postId = req.params.postid
    const { _id, likedPosts } = req.user

    if (!postId) {
        return res.status(400).json({ message: 'Post ID required' })
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Wrong Post Id, please check Try Again' })
    }

    const post = await PostModal.findOne({ _id: postId })
    if (!post) {
        return res.status(400).json({ message: 'No Post in this Id' })
    }
    let { likedBy } = post

    if (likedPosts.includes(postId) || likedBy.includes(_id)) {
        await UserModal.updateOne({ _id }, { $pull: { likedPosts: postId } });
        await PostModal.updateOne({ _id: postId }, { $pull: { likedBy: _id } });

        return res.status(200).json({ message: 'Post unliked successfully' })
    } else {
        await UserModal.updateOne({ _id }, { $addToSet: { likedPosts: postId } })
        await PostModal.updateOne({ _id: postId }, { $addToSet: { likedBy: _id } })

        res.status(200).json({ message: 'Post liked successfully' });
    }
})

//@desc update Bookmark a post
//@route PATCH / posts
//@access Private
const bookmarkThePost = asyncHandler(async (req, res) => {
    let postId = req.params.postid
    let { _id, bookmarks } = req.user

    if (!postId) {
        return res.status(400).json({ message: 'Post ID required' })
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Wrong Post Id, please check Try Again' })
    }

    const post = await PostModal.findOne({ _id: postId })
    if (!post) {
        return res.status(400).json({ message: 'No Post in this Id' })
    }

    if (bookmarks.includes(postId)) {
        await UserModal.updateOne({ _id }, { $pull: { bookmarks: postId } });

        return res.status(200).json({ message: 'Post unliked successfully' })
    } else {
        await UserModal.updateOne({ _id }, { $addToSet: { bookmarks: postId } })

        res.status(200).json({ message: 'Post liked successfully' });
    }

})

//@desc delete a users
//@route DELETE / posts
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
    likePost,
    bookmarkThePost,
    deletePost
}