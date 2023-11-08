const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const commentsController = require('../controllers/commentsContoller')

router.use(verifyJWT)

router.route('/:commentPostId')
    .get(commentsController.getAllCommentsOfPosts)
    .post(commentsController.postCommentsOfPosts)

router.route('/:commentId')
    .delete(commentsController.deleteACommentOfPosts)

module.exports = router
