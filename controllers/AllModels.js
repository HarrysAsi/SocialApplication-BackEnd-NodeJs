const User = require('../models/User');
const UserType = require('../models/UserType');
const FriendType = require('../models/FriendType');
const FriendStatus = require('../models/FriendStatus');
const Friends = require('../models/Friend');
const Announcement = require('../models/Announcement');
const AnnouncementLikes = require('../models/AnnouncementLikes');
const Conversation = require('../models/Conversation');
const ConversationParticipants = require('../models/ConversationParticipants');
const Image = require('../models/Image');
const FriendRequest = require('../models/FriendRequest');

const InternalServerErrorCodes = require('../functions/internalServerErrorCodes');
const jwt = require('jsonwebtoken');
const CustomResponse = require('../helpers/CustomResponse');

const user = new User("user");
const userType = new UserType("user_type");
const friendType = new FriendType("friend_type");
const friendStatus = new FriendStatus("friend_status");
const friend = new Friends("friends");
const image = new Image('image');
const announcements = new Announcement("announcement");
const announcement_likes = new AnnouncementLikes("announcement_likes");
const conversations = new Conversation("conversation");
const conversationParticipants = new ConversationParticipants("conversation_participants");
const friendRequests = new FriendRequest('friend_request');


exports.postPrivateAllModels = function (req, res, next, callback = function () {
}) {
    this.callback = callback;
    this.user_id = req.body.userId || null;
    console.log(this.user_id);
    if (this.user_id === undefined || this.user_id === null) {
        console.log(this.user_id);
        let status = new InternalServerErrorCodes().errorCodes(-2);
        new CustomResponse(res, req, status, 400);
    } else {
        let result = {};
        let i = 0;
        let len = 12;

        try {
            function onResult() {
                i++;
                if (i === len) {
                    let status = new InternalServerErrorCodes().errorCodes(0);
                    new CustomResponse(res, req, status, 200, result);
                }
            }

            user.query("select * from user where user.id IN (select friend_id from user, friends where user.id = friends.user_id and user.id = " + this.user_id + " )", function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.users = row;
                onResult();
            });

            userType.query("select * from user_type", function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.user_type = row;
                onResult();
            });
            friendType.query("select * from friend_type", function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.friend_type = row;
                onResult();
            });
            friendStatus.query("select * from friend_status", function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.friend_status = row;
                onResult();
            });
            friend.query("select * from friends where user_id = " + this.user_id, function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.friends = row;
                onResult();
            });

            announcements.query("select * from announcement where announcement.user_id IN (select friends.friend_id from user, friends where user.id = friends.user_id and user.id =" + this.user_id + " ) OR announcement.user_id = " + this.user_id + " ORDER BY date_created", function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.announcements = row;
                onResult();
            });

            announcement_likes.query("select * from announcement_likes where user_id = " + this.user_id + " ", function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.announcement_likes = row;
                onResult();
            });

            conversations.query("select * from conversation where conversation.id IN (select conversation_id from conversation_participants where conversation_participants.participant_id = " + this.user_id + " )", function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.conversations = row;
                onResult();
            });

            conversationParticipants.query("select * from conversation_participants where conversation_participants.conversation_id IN " +
                "                           (select id from conversation where conversation.id IN (" +
                "                           select conversation_id from conversation_participants where conversation_participants.participant_id = " + this.user_id + " )) AND conversation_participants.participant_id != " + this.user_id + "  ", function (err, row, fields) {
                let status = 0;
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.conversation_participants = row;
                onResult();
            });

            image.query("select * from image where image.id IN (select image_id from user where id IN (select friend_id from friends where friends.user_id = " + this.user_id + " ))", function (err, row, fields) {
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                }
                result.friend_images = row;
                onResult();
            });

            user.query("select * from user where user.id != " + this.user_id + " AND user.id NOT IN (select friend_id from friends where friends.user_id = " + this.user_id + ") AND user.id NOT IN " +
                "(select receiver_user_id from friend_request where friend_request.sender_user_id = "+ this.user_id +")", function (err, row, fields) {
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500, row);
                }
               result.suggested_users = row;
                onResult();
            });

            friendRequests.query("select * from user where user.id IN (select sender_user_id from friend_request where friend_request.receiver_user_id = " + user_id + ") ", function (err, row, fields) {
                if (err) {
                    status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                } else {
                    let response = {};
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
                    response.friend_request_users = result_users;
                    friendRequests.query("select * from friend_request where friend_request.receiver_user_id =" + user_id + " ", function (err, row1, fields) {
                        if (err) {
                            status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                            new CustomResponse(res, req, status, 500);
                        } else {
                            response.friend_requests = row1;
                            result.requests = response;
                            onResult();
                        }
                    });
                }

            });

        } catch (e) {
            status = new InternalServerErrorCodes().errorCodes(e.code);
            new CustomResponse(res, req, status, 500);
        }
    }

};
