const InternalServerErrorCodes = require('../functions/internalServerErrorCodes');
const jwt = require('jsonwebtoken');
const CustomResponse = require('../helpers/CustomResponse');

const Announcement = require('../models/Announcement');
const announcements = new Announcement("announcement");


exports.getPublicAnnouncements = function (req, res, next, callback = function () {}) {
    this.callback = callback;
    this.user_id = req.params.userId;
    try {
        announcements.query("select * from announcement where announcement.user_id IN (select friends.friend_id from user, friends where user.id = friends.user_id and user.id =" + this.user_id + " ) OR announcement.user_id = " + this.user_id + " ", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            }
            status = new InternalServerErrorCodes().errorCodes(0);
            new CustomResponse(res, req, status, 200, row);
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postPrivateAnnouncements = function (req, res, next, callback = function () {}) {
    this.callback = callback;
    this.user_id = req.body.userId;
    try {
        announcements.query("select * from announcement where announcement.user_id IN (select friends.friend_id from user, friends where user.id = friends.user_id and user.id =" + this.user_id + " ) OR announcement.user_id = " + this.user_id + " ORDER BY date_created", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            }
            status = new InternalServerErrorCodes().errorCodes(0);
            new CustomResponse(res, req, status, 200, row);
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postPrivateAddAnnouncement = function (req, res, next, callback = function () {}) {
    this.callback = callback;
    this.user_id = req.body.userId;
    this.content = req.body.content;
    try {
        console.log(this.user_id, this.content);
        announcements.query("INSERT INTO announcement (user_id, content) VALUES ('" + this.user_id + "', '" + this.content + "' )", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            }
            status = new InternalServerErrorCodes().errorCodes(0);
            new CustomResponse(res, req, status, 200, row);
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};
