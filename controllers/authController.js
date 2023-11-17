const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const allowedOrigins = require('../config/allowedOrigins')

//@desc Login
//@route POST / auth
//@access Public
const login = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ Status: 'error', message: `All fields are require` })
    }

    const foundUser = await User.findOne({ email: email }).lean().exec()
    if (!foundUser) return res.status(404).send({ Status: 'error', message: `Check Your credentials, ${email} is not Exist` })
    let { password: any, ...rem } = foundUser

    const isMatch = await bcrypt.compare(password, foundUser.password)
    if (!isMatch) return res.status(400).send({ Status: 'error', message: `Check Your credentials, Password is Wrong` })

    const accessToken = jwt.sign(rem, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign(rem, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

    res.cookie('jwt', refreshToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    })

    res.json({ status: "ok", user: { ...rem, accessToken } })
})

//@desc Refresh
//@route GET / auth / refresh
//@access Public - because access token has expired
const refresh = (req, res) => {
    const cookie = req.cookies.jwt

    if (!cookie) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookie

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, user) => {
            if (err) return res.status(403).send({ status: 'error', message: "Forbidden" })

            const foundUser = await User.findOne({ email: user.email }).lean().exec()
            if (!foundUser) return res.status(401).json({ status: 'error', message: "Unauthorized" })
            let { password: any, ...rem } = foundUser

            const accessToken = jwt.sign(rem, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.status(200).send({ status: 'ok', user: { ...rem, accessToken } })
        }))
}

//@desc Logout
//@route POST / auth / logout
//@access Public - just to clear cookie if exist
const logout = (req, res) => {
    const cookie = req.cookies

    if (!cookie?.jwt) return res.status(204).json({ status: 'error', message: "Logout Successfully no code" })
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    })

    res.status(200).json({ status: 'error', message: "Logout Successfully" })
}

module.exports = {
    login,
    refresh,
    logout
}