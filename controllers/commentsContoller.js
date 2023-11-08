const User = require('../models/users')
const CommentsModal = require('../models/comments')
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
    const comments = await CommentsModal.find({ commentPostId }).lean()
    if (comments.length <= 0) {
        return res.status(404).json({ message: 'no Comments Found' })
    }
    const commensList = await Promise.all(comments.map(async (item) => {
        let { commentPostId: postId, commentUserId: userId } = item
        try {
            let post = await PostsModal.findOne({ _id: postId }).lean()
            let user = await UsersModal.findOne({ _id: userId }).lean()

            item.title = post.title
            item.name = user.name
        } catch (error) {
            console.log(error)
        } finally {
            return item
        }
    }))

    return res.status(200).json({ comments: commensList, message: 'commentPostId' })
})

//@desc post comment
//@route Post / comment
//@access Private
const postCommentsOfPosts = asyncHandler(async (req, res) => {

    const { email, commentUserId, commentPostId, commentOwner, content } = req.body
    // try {

    if (!email || !commentUserId || !commentPostId || !commentOwner || !content) {
        return res.status(400).json({ message: 'All fields are Required' })
    }

    if (!mongoose.Types.ObjectId.isValid(commentPostId)) {
        return res.status(400).json({ message: 'Wrong post Id, please check Id Once Again' })
    }
    if (!mongoose.Types.ObjectId.isValid(commentUserId)) {
        return res.status(400).json({ message: 'user Id, please check Id Once Again' })
    }

    const user = await UsersModal.findOne({ _id: commentUserId }).lean().exec()
    if (!user) {
        return res.status(404).json({ message: 'User Not found, please refresh page try again' })
    }

    const post = await PostsModal.findOne({ _id: commentPostId }).lean().exec()
    if (!post) {
        return res.status(404).json({ message: 'Post Not found, please refresh page try again' })
    }

    const commentCheck = await CommentsModal.findOne({ commentPostId, commentUserId, content }).lean().exec()
    if (commentCheck) {
        return res.status(409).json({ message: 'Duplicate Found from You' })
    }

    const comment = await CommentsModal.create({ email, commentPostId, commentUserId, content, commentOwner })
    return res.status(200).json({ comment, message: 'Posted SuccessFully' })
    // } catch (error) {
    //     return res.status(404).json({ message: 'Something Wrong' })
    // }
})

//@desc delete comment
//@route DELETE / comment
//@access Private
const deleteACommentOfPosts = asyncHandler(async (req, res) => {
    let userId = req.user._id
    const { commentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: 'Wrong Comment Id, please check Id Once Again' })
    }

    const comment = await CommentsModal.findOne({ _id: commentId }).lean()

    if (!comment) {
        return res.status(404).json({ message: 'Comment Not Found' })
    }

    if (String(comment.commentUserId) == String(userId) || String(comment.commentOwner) == String(userId)) {
        const deleteComment = await CommentsModal.deleteOne({ _id: commentId })
        res.status(200).json({ comment, message: 'Deleted' })

    } else {
        res.status(401).json({ message: 'You dont have right to delete' })
    }

    // res.status(200).json({ message: 'You' })

})

module.exports = {
    getAllCommentsOfPosts,
    postCommentsOfPosts,
    deleteACommentOfPosts
}