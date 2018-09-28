const express = require('express');
const router = express.Router();
const checkAuth = require('../functions/check-auth');
const userController = require('../controllers/User');
const multer = require('multer');
const CustomResponse = require('../helpers/CustomResponse');
//File handler / multer
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images/');
    },
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    console.log(file);
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    } else {
        callback(new Error("Unexpected Image Format"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 8 // 8mb
    },
    fileFilter: fileFilter
});

//Default path " localhost:4500/users ", **GET** all users
router.get('/', userController.getPublicAllUsers);

//Default path " localhost:4500/users ", **POST** all users
router.post('/', checkAuth, userController.postPrivateAllUsers);

//Default path " localhost:4500/users/login ", **POST** Login-authenticate a user
router.post('/login', userController.postLogin);

//Default path " localhost:4500/users/signup ", **POST** Signup A User
router.post('/signup', userController.postSignup);

router.post('/update-user',upload.single('userImage'), userController.postPrivateUpdateUser);

module.exports = router;

