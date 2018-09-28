const express = require('express');
const router = express.Router();
const checkAuth = require('../functions/check-auth');
const allModelsController = require('../controllers/AllModels');


//Default path " localhost:4500/users ", **POST** all users
router.post('/', checkAuth, allModelsController.postPrivateAllModels);


module.exports = router;

