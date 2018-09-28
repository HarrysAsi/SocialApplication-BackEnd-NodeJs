const User = require('../models/User');
const UserType = require('../models/UserType');
const FriendType = require('../models/FriendType');
const FriendStatus = require('../models/FriendStatus');
const Friends = require('../models/Friend');

const InternalServerErrorCodes = require('../functions/internalServerErrorCodes');
const jwt = require('jsonwebtoken');
const CustomResponse = require('../helpers/CustomResponse');

const user = new User("user");

exports.getPublicSuggestedUsers = function (req, res, next, callback = function () {}) {
    this.callback = callback;
    this.user_id = req.params.userId;

    try {
        user.query("select * from user where user.id != " + this.user_id + " AND user.id NOT IN (select friend_id from friends where friends.user_id = " + this.user_id + ")", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500, row);
            }
            status = new InternalServerErrorCodes().errorCodes(status);
            new CustomResponse(res, req, status, 200, row);
        });
    }
    catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
}
;

exports.postPrivateSuggestedUsers = function (req, res, next, callback = function () {}) {
    this.callback = callback;
    this.user_id = req.body.userId;

    try {
        user.query("select * from user where user.id != " + this.user_id + " AND user.id NOT IN (select friend_id from friends where friends.user_id = " + this.user_id + ") AND user.id NOT IN " +
            "(select receiver_user_id from friend_request where friend_request.sender_user_id = "+ this.user_id +") ", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500, row);
            }
            status = new InternalServerErrorCodes().errorCodes(status);
            new CustomResponse(res, req, status, 200, row);
        });
    }
    catch
        (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};
