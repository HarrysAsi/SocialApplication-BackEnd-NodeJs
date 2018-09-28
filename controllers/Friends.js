const User = require('../models/User');
const Friend = require('../models/Friend');
const InternalServerErrorCodes = require('../functions/internalServerErrorCodes');
const CustomResponse = require('../helpers/CustomResponse');
const checkUndefined = require('../functions/check-input');


exports.postPrivateFriendsUsers = function (req, res, next) {
    const friend = new Friend("friends");
    try {
        const user_id = req.body.userId;
        friend.query("select * from user where user.id IN (select friends.friend_id from friends where user_id = " + user_id + " AND friend_status = 2)", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            }
            status = new InternalServerErrorCodes().errorCodes(status);
            new CustomResponse(res, req, status, 200, row);
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postPrivateFriends = function (req, res, next) {
    const friend = new Friend("friends");
    try {
        const user_id = req.body.userId;
        friend.query("select * from friends where friend_id = " + user_id + " AND friend_status = 2", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            }
            status = new InternalServerErrorCodes().errorCodes(status);
            new CustomResponse(res, req, status, 200, row);
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};


exports.postPrivateDeleteFriend = function (req, res, next) {
    const friend = new Friend("friends");
    try {
        const user_id = req.body.userId;
        const friend_id = req.body.friendId;
        friend.query("delete from friends where user_id = " + user_id + " and friend_id = " + friend_id + " ", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            } else {
                if (row.affectedRows >= 1) {
                    friend.query("delete from friends where user_id = " + friend_id + " and friend_id = " + user_id + " ", function (err, row, fields) {
                        if (err) {
                            status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                            new CustomResponse(res, req, status, 500);
                        } else {
                            if (row.affectedRows >= 1) {
                                status = new InternalServerErrorCodes().errorCodes(status);
                                new CustomResponse(res, req, status, 200, row);
                            } else {
                                status = new InternalServerErrorCodes().mySqlErrorCodes(-2);
                                new CustomResponse(res, req, status, 500);
                            }
                        }
                    });
                } else {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(-2);
                    new CustomResponse(res, req, status, 500);
                }
            }
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postPrivateAddFriend = function (req, res, next) {
    const friend_request = new Friend("friend_request");
    try {
        const user_id = req.body.userId;
        const friend_id = req.body.friendId;
        friend_request.query("insert into friend_request (sender_user_id, receiver_user_id,status_id) VALUES  ('" + user_id + "', '" + friend_id + "', 1)", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            } else {
                status = new InternalServerErrorCodes().errorCodes(0);
                new CustomResponse(res, req, status, 200, row);
            }
        });
    } catch
        (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
}
;