const asyncHandler = require('express-async-handler')
const PostModal = require('../models/post')
const UserModal = require('../models/users')


//@desc new
//@route GET / feed
//@access Private
const newFeed = asyncHandler(async (req, res) => {
    const totalPosts = await PostModal.countDocuments()

    if (totalPosts < 1) return res.status(404).json({ message: "no posts are found" })

    let postsList = await PostModal.find().sort({ createdAt: -1 }).lean()
    const usersIds = postsList.map((post) => post.userId)
    const users = await UserModal.find({ _id: usersIds }).select({ name: 1 }).lean()

    let posts = await Promise.all(postsList.map((post) => {
        const user = users.find(user => user._id.toString() === post.userId.toString());

        return {
            ...post, userName: user ? user.name : null
        };
    }))
    res.status(200).json(posts)
})

//@desc following
//@route GET / feed 
//@access Private 
const followingFeed = asyncHandler(async (req, res) => {
    const { following } = req.user

    const postsList = await PostModal.find({ userId: { $in: following } }).lean().sort({ createdAt: -1 })

    if (postsList.length === 0) return res.status(404).json({ message: "no posts are found" })
    const usersIds = postsList.map((post) => post.userId)
    const users = await UserModal.find({ _id: usersIds }).select({ name: 1 }).lean()

    let posts = await Promise.all(postsList.map((post) => {
        const user = users.find(user => user._id.toString() === post.userId.toString());

        return {
            ...post, userName: user ? user.name : null
        };
    }))
    res.status(200).json(posts)
})

//@desc someFeed
//@route GET / feed 
//@access Private 
const someFeed = asyncHandler(async (req, res) => {
    const perPage = 8;

    const totalPosts = await PostModal.countDocuments();

    if (totalPosts < 1) return res.status(404).json({ message: "No posts are found" });

    const randomPosts = await PostModal.aggregate([
        { $sample: { size: perPage } },
    ]).exec();

    const usersIds = randomPosts.map((post) => post.userId)
    const users = await UserModal.find({ _id: usersIds }).select({ name: 1 }).lean()

    let posts = await Promise.all(randomPosts.map((post) => {
        const user = users.find(user => user._id.toString() === post.userId.toString());

        return {
            ...post, userName: user ? user.name : null
        };
    }))
    res.status(200).json(posts);
})


//@desc new
//@route GET / feed
//@access Private
const newFeedAll = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.perpage || 1;
    const totalPosts = await PostModal.countDocuments()
    let posts;

    if (totalPosts < 1) {
        return res.status(404).json({ message: "no posts are found" })
    }
    if (totalPosts > perPage) {
        posts = await PostModal.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).lean()
    } else {
        posts = await PostModal.find().sort({ createdAt: -1 }).lean()
    }
    const usersIds = posts.map((post) => post.userId)
    const users = await UserModal.find({ _id: usersIds }).select({ name: 1 }).lean()
    let postsList = await Promise.all(posts.map((post) => {
        const user = users.find(user => user._id.toString() === post.userId.toString());

        return {
            ...post, userName: user ? user.name : null
        };
    }))
    const totalPages = Math.ceil(totalPosts / perPage)

    res.status(200).json({ posts: postsList, totalPosts, totalPages, page })
})

//@desc following
//@route GET / feed 
//@access Private 
const followingFeedAll = asyncHandler(async (req, res) => {
    let { following } = req.user
    const page = req.query.page || 1;
    const perPage = req.query.perpage || 1;
    const totalPosts = await PostModal.countDocuments({ userId: { $in: following } })
    let posts;

    if (totalPosts < 1) {
        return res.status(404).json({ message: "no posts are found" })
    }
    if (totalPosts > perPage) {
        posts = await PostModal.find({ userId: { $in: following } }).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).lean()
    } else {
        posts = await PostModal.find({ userId: { $in: following } }).sort({ createdAt: -1 }).lean()
    }
    const usersIds = posts.map((post) => post.userId)
    const users = await UserModal.find({ _id: usersIds }).select({ name: 1 }).lean()
    let postsList = await Promise.all(posts.map((post) => {
        const user = users.find(user => user._id.toString() === post.userId.toString());

        return {
            ...post, userName: user ? user.name : null
        };
    }))
    const totalPages = Math.ceil(totalPosts / perPage)

    res.status(200).json({ posts: postsList, totalPosts, totalPages, page })
})



module.exports = {
    newFeed,
    followingFeed,
    newFeedAll,
    followingFeedAll,
    someFeed,
}