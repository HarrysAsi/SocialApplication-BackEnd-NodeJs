const express = require('express');
const router = express.Router();
const checkAuth = require('../functions/check-auth');
const suggestedUsers = require('../controllers/SuggestedUsers');


//Default path " localhost:4500/users ", **GET** all users
router.get('/:userId', suggestedUsers.getPublicSuggestedUsers);

//Default path " localhost:4500/users ", **POST** all users
router.post('/', checkAuth, suggestedUsers.postPrivateSuggestedUsers);


module.exports = router;

