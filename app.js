const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const usersRoute = require('./routes/user');
const allModelsRoute = require('./routes/allModels');
const friendsRoute = require('./routes/friends');
const suggestedUsersRoute = require('./routes/suggestedUsers');
const announcementsRoute = require('./routes/announcements');
const announcementLikesRoute = require('./routes/announcementLikes');
const messagesRoute = require('./routes/messages');
const friendRequestRoute = require('./routes/friend_requests');

// some development logging...
app.use(morgan('dev'));
app.use('/images',express.static('images'));
// Data formatting, url encoded, json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handle CORS HEADERS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routers that handles requests
app.use('/users', usersRoute);
app.use('/all-models', allModelsRoute);
app.use('/friends', friendsRoute);
app.use('/suggested-users', suggestedUsersRoute);
app.use('/announcements', announcementsRoute);
app.use('/announcement-likes', announcementLikesRoute);
app.use('/messages', messagesRoute);
app.use('/friend-requests', friendRequestRoute);


//Every request that reaches this line, means that its not routed
app.use(function (req, res, next) {
    const error = new Error('Request not found.');
    error.status = 404;
    next(error);
});

//Errors thrown everywhere else
app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
