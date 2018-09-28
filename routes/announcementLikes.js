const express = require('express');
const router = express.Router();
const checkAuth = require('../functions/check-auth');
const announcementLikesController = require('../controllers/AnnouncementLikes');


//Default path " localhost:4500/users ", **GET** all users
router.get('/:userId', announcementLikesController.getPublicAnnouncementLikes);

//Default path " localhost:4500/users ", **POST** all users
router.post('/', checkAuth, announcementLikesController.postPrivateAnnouncementLikes);

//Default path " localhost:4500/announcement-likes/remove-like ", **POST** all users
router.post('/remove-like', checkAuth, announcementLikesController.postPrivateRemoveLike);

//Default path " localhost:4500/announcement-likes/add-like ", **POST** all users
router.post('/add-like', checkAuth, announcementLikesController.postPrivateAddLike);


module.exports = router;

