const express = require('express')
const router = express.Router()
const userModal = require("../models/users")
const bcrypt = require('bcrypt')



router.post("/", async (req, res) => {
    let { password, ...userData } = req.body;
    try {
        isExist = await userModal.findOne({ email: userData.email })
        if (isExist) {
            return res.status(400).send({ status: 'error', message: "User Already Exist" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new userModal({ ...userData, password: hashPassword })
        const createdUser = await newUser.save();
        res.status(201).send(createdUser)
    } catch (err) {
        res.status(500).send({ status: 'error', message: "Some Thing wrong on Server" })
    }
})

module.exports = router