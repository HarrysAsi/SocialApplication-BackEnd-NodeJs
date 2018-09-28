const express = require('express');
const router = express.Router();
const checkAuth = require('../functions/check-auth');
const friendRequests = require('../controllers/FriendRequests');


//Default path " localhost:4500/users ", **POST** all users
router.post('/', checkAuth, friendRequests.postPrivateFriendRequests);
//Default path " localhost:4500/friend-requests/accept ", **POST**

router.post('/accept', checkAuth, friendRequests.postPrivateAcceptFriendRequest);

//Default path " localhost:4500/friend-requests/decline ", **POST** all users
router.post('/decline', checkAuth, friendRequests.postPrivateDeclineFriendRequest);


module.exports = router;

