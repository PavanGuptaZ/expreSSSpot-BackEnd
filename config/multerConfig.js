const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        let filename = uuidv4() + "." + file.originalname.split('.').reverse()[0]
        req.body.image = filename
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        console.log(file.mimetype + " is not Support")
        cb(null, false)
    }
}

module.exports.storage = storage;
module.exports.fileFilter = fileFilter;