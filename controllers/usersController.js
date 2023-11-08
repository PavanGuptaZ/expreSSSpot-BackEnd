const mongoose = require('mongoose')
const User = require('../models/users')
const Post = require('../models/post')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const UsersModal = require('../models/users')

//@desc Get all users
//@route GET / users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No User Found' })
    }
    res.status(200).json(users)
})
const uploadProfilePic = asyncHandler(async (req, res) => {
    const { _id } = req.user
    console.log(req.body.profileimgName)
    await UsersModal.updateOne({ _id }, {
        $set: { profilePic: req.body.profileimgName }
    })

    return res.status(200).json({ message: "Profile pic Updated" })

})
const allFollowingUsers = asyncHandler(async (req, res) => {
    let { following } = req.user

    const users = await User.find({ _id: { $in: following } }).select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No User Found' })
    }
    res.status(200).json(users)
})

const allFollowersUsers = asyncHandler(async (req, res) => {
    let { followingBy } = req.user

    const users = await User.find({ _id: { $in: followingBy } }).select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No User Found' })
    }
    res.status(200).json(users)
})

const getUserAProfile = asyncHandler(async (req, res) => {
    let { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Wrong post Id, please check Id Once Again' })
    }
    const user = await User.findOne({ _id: id }).select('-password').lean()
    if (!user) {
        return res.status(400).json({ message: 'No User Found' })
    }
    res.status(200).json(user)
})

//@desc Create all users
//@route POST / users
//@access Private
const createNewUsers = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are Required' })
    }

    const duplicate = await User.findOne({ email }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Email' })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const userObject = { email, password: hashPassword }

    const user = await User.create(userObject)

    if (user) {
        res.status(200).json({ message: `New User ${email} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

//@desc update a users
//@route PATCH / users
//@access Private
const updateUsers = asyncHandler(async (req, res) => {
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
const deleteUsers = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'User ID required' })
    }

    const posts = await Post.findOne({ _id }).lean().exec()
    if (posts) {
        return res.status(400).json({ message: 'User has Posts' })
    }

    const user = await User.findOne({ _id }).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()
    const reply = `UserName ${result.email} with ID ${result._id}`
    res.json(reply)
})

const updateName = asyncHandler(async (req, res) => {
    let { _id } = req.user
    let { name } = req.body

    if (!name) {
        return res.status(404).json({ message: "User name is Required, 404 Error" })
    }
    const user = await UsersModal.findOne({ _id }).lean()
    if (!user) {
        return res.status(404).json({ message: "User Not Found, 404 Error" })
    }
    let result = await UsersModal.updateOne({ _id }, {
        $set: { name }
    }, { new: true })
    console.log(user)
    return res.status(200).json({ message: "User name Updated" })
})

const updateDescription = asyncHandler(async (req, res) => {
    let { _id } = req.user
    let { description } = req.body

    if (!description) {
        return res.status(404).json({ message: "User description is Required, 404 Error" })
    }
    const user = await UsersModal.findOne({ _id }).lean()
    if (!user) {
        return res.status(404).json({ message: "User Not Found, 404 Error" })
    }
    let result = await UsersModal.updateOne({ _id }, {
        $set: { description }
    }, { new: true })

    return res.status(200).json({ message: "User description Updated" })
})

const followTheUser = asyncHandler(async (req, res) => {
    let { _id } = req.user
    let { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Wrong User Id, please check Id Once Again' })
    }
    const user = await UsersModal.findOne({ _id }).lean()
    const userFollowing = await UsersModal.findOne({ _id: id }).lean()
    if (!user) {
        return res.status(404).json({ message: "User Not Found, 404 Error" })
    }
    if (!userFollowing) {
        return res.status(404).json({ message: "User Following not Found, 404 Error" })
    }
    const { following } = user
    const { followingBy } = userFollowing
    if (following.includes(id) || followingBy.includes(_id)) {
        return res.status(409).json({ message: "you are already following that user" })
    }

    following.push(id)
    followingBy.push(_id)

    await UsersModal.updateOne({ _id }, { $set: { following } })
    await UsersModal.updateOne({ _id: id }, { $set: { followingBy } })

    return res.status(200).json({ message: "User Following Updated" })
})

const unfollowTheUser = asyncHandler(async (req, res) => {
    let { _id } = req.user;
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid User ID. Please check the ID once again.' });
    }

    const user = await UsersModal.findOne({ _id }).lean();
    const userToUnfollow = await UsersModal.findOne({ _id: id }).lean();

    if (!user) {
        return res.status(404).json({ message: 'User Not Found. 404 Error' });
    }

    if (!userToUnfollow) {
        return res.status(404).json({ message: 'User to unfollow not found. 404 Error' });
    }

    const { following } = user;
    const { followingBy } = userToUnfollow;

    if (!following.includes(id) || !followingBy.includes(_id)) {
        return res.status(409).json({ message: 'You are not following that user' });
    }

    const updatedFollowing = following.filter(userId => userId.toString() !== id.toString());
    const updatedFollowingBy = followingBy.filter(userId => userId.toString() !== _id.toString());

    await UsersModal.updateOne({ _id }, { $set: { following: updatedFollowing } });
    await UsersModal.updateOne({ _id: id }, { $set: { followingBy: updatedFollowingBy } });

    return res.status(200).json({ message: 'User Unfollowed' });
});

module.exports = {
    getAllUsers,
    uploadProfilePic,
    allFollowingUsers,
    allFollowersUsers,
    getUserAProfile,
    createNewUsers,
    updateUsers,
    deleteUsers,
    updateName,
    updateDescription,
    unfollowTheUser,
    followTheUser
}