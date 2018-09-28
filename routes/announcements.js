const express = require('express');
const router = express.Router();
const checkAuth = require('../functions/check-auth');
const announcementsController = require('../controllers/Announcements');


//Default path " localhost:4500/users ", **GET** all users
router.get('/:userId', announcementsController.getPublicAnnouncements);

//Default path " localhost:4500/users ", **POST** all users
router.post('/', checkAuth, announcementsController.postPrivateAnnouncements);

router.post('/add-announcement', checkAuth, announcementsController.postPrivateAddAnnouncement);


module.exports = router;

