const express = require('express')
const router = express.Router()
const postsController = require('../controllers/postsController')
const verifyJWT = require('../middleware/verifyJWT')
const multer = require('multer')
const { storagePost: storage, fileFilter } = require('../config/multerConfig')
router.use(verifyJWT)

const upload = multer({ storage, limits: { fieldSize: 2000000 }, fileFilter })

router.route('/')
    .get(postsController.getAllPosts)
    .post(upload.single('image'), postsController.createNewPost)
    .patch(postsController.updatePost)
    .delete(postsController.deletePost)

router.get('/user/:id', postsController.getAllPostOfUsers)
router.get('/likes', postsController.getAllLikedByUsers)
router.get('/comments', postsController.getAllCommentedByUsers)
router.get('/bookmarks', postsController.getAllBookmarkedByUsers)
router.get('/:id', postsController.getSpecificPostById)

module.exports = router