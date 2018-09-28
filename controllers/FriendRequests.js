const FriendRequest = require('../models/FriendRequest');
const Conversation = require('../models/Conversation');
const InternalServerErrorCodes = require('../functions/internalServerErrorCodes');
const CustomResponse = require('../helpers/CustomResponse');


exports.postPrivateFriendRequests = function (req, res, next) {
    const friendRequests = new FriendRequest("friend_request");
    try {
        const user_id = req.body.userId;
        console.log(user_id);
        let status = 0;
        friendRequests.query("select * from user where user.id IN (select sender_user_id from friend_request where friend_request.receiver_user_id = " + user_id + ") ", function (err, row, fields) {
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            } else {
                let result_users = [];
                for (let i = 0; i < row.length; i++) {
                    result_users.push({
                        id: row[i].id,
                        email: row[i].email,
                        name: row[i].name,
                        surname: row[i].surname,
                        birthdate: row[i].birthdate,
                        mobile_tel: row[i].mobile_tel,
                        image_id: row[i].image_id,
                        country: row[i].country,
                        user_type: row[i].user_type,
                        date_created: row[i].date_created,
                        date_updated: row[i].date_updated
                    });
                }
                let response = {};
                response.users = result_users;
                friendRequests.query("select * from friend_request where friend_request.receiver_user_id =" + user_id + " ", function (err, row1, fields) {
                    if (err) {
                        status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                        new CustomResponse(res, req, status, 500);
                    } else {
                        response.friend_requests = row1;
                        status = new InternalServerErrorCodes().errorCodes(status);
                        new CustomResponse(res, req, status, 200, response);
                    }
                });
            }

        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};


exports.postPrivateDeclineFriendRequest = function (req, res, next) {
    const friendRequests = new FriendRequest("friend_request");
    try {
        const receiver_user_id = req.body.receiver_user_id;
        const sender_user_id = req.body.sender_user_id;
        console.log(receiver_user_id);
        console.log(sender_user_id);
        let status = 0;
        friendRequests.query("delete from friend_request where sender_user_id = " + sender_user_id + " and receiver_user_id = " + receiver_user_id + " ", function (err, row, fields) {
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            } else {
                status = new InternalServerErrorCodes().errorCodes(status);
                new CustomResponse(res, req, status, 200, row);
            }
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postPrivateAcceptFriendRequest = function (req, res, next) {
    const friendRequests = new FriendRequest("friend_request");
    const conversation = new Conversation("friend_conversations");
    try {
        const receiver_user_id = req.body.receiver_user_id;
        const sender_user_id = req.body.sender_user_id;
        console.log(receiver_user_id);
        console.log(sender_user_id);
        let status = 0;

        friendRequests.query("delete from friend_request where sender_user_id = " + sender_user_id + " and receiver_user_id = " + receiver_user_id + " ", function (err, row, fields) {
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            } else {
                friendRequests.query("insert into friends(user_id, friend_id, friend_type, friend_status) values (" + receiver_user_id + ", " + sender_user_id + ", 1, 2) ", function (err, row, fields) {
                    if (err) {
                        status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                        new CustomResponse(res, req, status, 500);
                    } else {
                        friendRequests.query("insert into friends(user_id, friend_id, friend_type, friend_status) values (" + sender_user_id + ", " + receiver_user_id + ", 1, 2) ", function (err, row, fields) {
                            if (err) {
                                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                                new CustomResponse(res, req, status, 500);
                            } else {
                                conversation.query("insert into conversation(creator_id) VALUES (" + sender_user_id + ")", function(err, row, fields){
                                    if(err){
                                        status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                                        new CustomResponse(res, req, status, 500);
                                    } else {
                                        let conversation_inserted_id = row.insertId;
                                        conversation.query("insert into conversation_participants(conversation_id, participant_id) VALUES (" + conversation_inserted_id + ", "+ sender_user_id +" )", function(err, row, fields){
                                            if(err){
                                                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                                                new CustomResponse(res, req, status, 500);
                                            } else {
                                                conversation.query("insert into conversation_participants(conversation_id, participant_id) VALUES (" + conversation_inserted_id + ", "+ receiver_user_id +" )", function(err, row, fields){
                                                    if(err){
                                                        status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                                                        new CustomResponse(res, req, status, 500);
                                                    } else {
                                                        status = new InternalServerErrorCodes().errorCodes(0);
                                                        new CustomResponse(res, req, status, 200, row);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });

                            }
                        });
                    }
                });
            }
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }

};