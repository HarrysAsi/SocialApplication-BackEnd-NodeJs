const express = require('express');
const router = express.Router();
const checkAuth = require('../functions/check-auth');
const messagesController = require('../controllers/Messages');


//Default path " localhost:4500/friends ", **GET** user friends
router.post('/', messagesController.postPrivateAllMessages);
//
// //Default path " localhost:4500/users ", **POST** all users
// router.post('/', checkAuth, userController.postPrivateAllUsers);


module.exports = router;

