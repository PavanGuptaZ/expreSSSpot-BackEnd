const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const multer = require('multer')
const { storageProfile: storage, fileFilter } = require('../config/multerConfig')

router.use(verifyJWT)

const upload = multer({ storage, limits: { fieldSize: 2000000 }, fileFilter })

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUsers)
    .patch(usersController.updateUsers)
    .delete(usersController.deleteUsers)

router.route('/userDetails/:id')
    .get(usersController.getUserAProfile)

router.route('/uploadprofilepic')
    .patch(upload.single('profileimg'), usersController.uploadProfilePic)

router.route('/updatename')
    .patch(usersController.updateName)

router.route('/updatedescription')
    .patch(usersController.updateDescription)

router.route('/followingList')
    .get(usersController.allFollowingUsers)

router.route('/followersList')
    .get(usersController.allFollowersUsers)

router.route('/follow/:id')
    .patch(usersController.followTheUser)

router.route('/unfollow/:id')
    .patch(usersController.unfollowTheUser)

module.exports = router