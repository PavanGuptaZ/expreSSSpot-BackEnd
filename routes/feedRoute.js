const express = require('express')
const router = express.Router()
const feedController = require('../controllers/feedController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route("/new")
    .get(feedController.newFeed)

router.route("/follow")
    .get(feedController.followingFeed)

router.route("/some")
    .get(feedController.someFeed)


module.exports = router
