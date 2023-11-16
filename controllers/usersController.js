const mongoose = require('mongoose')
const UserModal = require('../models/users')
const Post = require('../models/post')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET / user
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserModal.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No User Found' })
    }
    res.status(200).json(users)
})
const uploadProfilePic = asyncHandler(async (req, res) => {
    const { _id } = req.user

    await UserModal.updateOne({ _id }, {
        $set: { profilePic: req.body.profileimgName }
    })

    return res.status(200).json({ message: "Profile pic Updated" })

})

//@desc Get all following users
//@route GET / user
//@access Private
const allFollowingUsers = asyncHandler(async (req, res) => {
    let { following } = req.user

    const users = await UserModal.find({ _id: { $in: following } }).select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No User Found' })
    }
    res.status(200).json(users)
})

//@desc Get all follower users
//@route GET / user
//@access Private
const allFollowersUsers = asyncHandler(async (req, res) => {
    let { followingBy } = req.user

    const users = await UserModal.find({ _id: { $in: followingBy } }).select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No User Found' })
    }
    res.status(200).json(users)
})

//@desc Get a user
//@route GET / user
//@access Private
const getUserAProfile = asyncHandler(async (req, res) => {
    let { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Wrong post Id, please check Id Once Again' })
    }
    const user = await UserModal.findOne({ _id: id }).select('-password').lean()
    if (!user) {
        return res.status(400).json({ message: 'No User Found' })
    }
    res.status(200).json(user)
})

//@desc Create all user
//@route POST / user
//@access Private
const createNewUsers = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are Required' })
    }

    const duplicate = await UserModal.findOne({ email }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Email' })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const userObject = { email, password: hashPassword }

    const user = await UserModal.create(userObject)

    if (user) {
        res.status(200).json({ message: `New User ${email} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

//                          ****incompleted****
//@desc update a user
//@route PATCH / user
//@access Private
const updateUsers = asyncHandler(async (req, res) => {
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

//                          ****incompleted****
//@desc delete a user
//@route DELETE / user
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

    const user = await UserModal.findOne({ _id }).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()
    const reply = `UserName ${result.email} with ID ${result._id}`
    res.json(reply)
})

//@desc update a user name
//@route PATCH / user
//@access Private
const updateName = asyncHandler(async (req, res) => {
    let { _id } = req.user
    let { name } = req.body

    if (!name) {
        return res.status(404).json({ message: "User name is Required, 404 Error" })
    }
    const user = await UserModal.findOne({ _id }).lean()
    if (!user) {
        return res.status(404).json({ message: "User Not Found, 404 Error" })
    }
    let result = await UserModal.updateOne({ _id }, {
        $set: { name }
    }, { new: true })

    return res.status(200).json({ message: "User name Updated" })
})

//@desc update a user description
//@route PATCH / user
//@access Private
const updateDescription = asyncHandler(async (req, res) => {
    let { _id } = req.user
    let { description } = req.body

    if (!description) {
        return res.status(404).json({ message: "User description is Required, 404 Error" })
    }
    const user = await UserModal.findOne({ _id }).lean()
    if (!user) {
        return res.status(404).json({ message: "User Not Found, 404 Error" })
    }
    let result = await UserModal.updateOne({ _id }, {
        $set: { description }
    }, { new: true })

    return res.status(200).json({ message: "User description Updated" })
})

//@desc update a user follow
//@route PATCH / user
//@access Private
const followTheUser = asyncHandler(async (req, res) => {
    let { _id } = req.user
    let { id } = req.params
    if (_id.toString() == id.toString()) {
        return res.status(400).json({ message: 'Same user cant follow him self' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Wrong User Id, please check Id Once Again' })
    }
    const user = await UserModal.findOne({ _id }).lean()
    const userFollowing = await UserModal.findOne({ _id: id }).lean()
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

    await UserModal.updateOne({ _id }, { $set: { following } })
    await UserModal.updateOne({ _id: id }, { $set: { followingBy } })

    return res.status(200).json({ message: "User Following Updated" })
})

//@desc update a user unfollow
//@route PATCH / user
//@access Private
const unfollowTheUser = asyncHandler(async (req, res) => {
    let { _id } = req.user;
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid User ID. Please check the ID once again.' });
    }

    const user = await UserModal.findOne({ _id }).lean();
    const userToUnfollow = await UserModal.findOne({ _id: id }).lean();

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

    await UserModal.updateOne({ _id }, { $set: { following: updatedFollowing } });
    await UserModal.updateOne({ _id: id }, { $set: { followingBy: updatedFollowingBy } });

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