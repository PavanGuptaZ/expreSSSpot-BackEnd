const express = require('express')
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
    res.json(users)
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

module.exports = {
    getAllUsers,
    createNewUsers,
    updateUsers,
    deleteUsers
}