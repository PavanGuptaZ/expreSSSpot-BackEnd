const express = require('express')
const router = express.Router()
const feedsController = require('../controllers/feedController')
const verifyJWT = require('../middleware/verifyJWT')
router.use(verifyJWT)

router.get('/new', feedsController.newFeed)
router.get('/following', feedsController.followingFeed)
router.get('/somefeed', feedsController.someFeed)

router.get('/newall', feedsController.newFeedAll)
router.get('/followingall', feedsController.followingFeedAll)

module.exports = router