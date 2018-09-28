const express = require('express');
const router = express.Router();
const checkAuth = require('../functions/check-auth');
const friendsController = require('../controllers/Friends');


router.post("/", checkAuth, friendsController.postPrivateFriendsUsers);

router.post("/friends", checkAuth, friendsController.postPrivateFriends);

router.post("/delete-friend", friendsController.postPrivateDeleteFriend);

router.post('/add-friend', checkAuth, friendsController.postPrivateAddFriend);


module.exports = router;

