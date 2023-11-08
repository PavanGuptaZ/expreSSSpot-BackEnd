const asyncHandler = require('express-async-handler')


//@desc new
//@route GET / auth
//@access Public
const newFeed = asyncHandler(async (req, res) => {
    console.log(req.body)
})

//@desc following
//@route GET / auth 
//@access Public 
const followingFeed = (req, res) => {
    console.log(req.body)
}

//@desc someFeed
//@route GET / auth 
//@access Public 
const someFeed = (req, res) => {
    console.log(req.body)
}

module.exports = {
    newFeed,
    followingFeed,
    someFeed
}