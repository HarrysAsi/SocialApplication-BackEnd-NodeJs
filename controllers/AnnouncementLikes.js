const InternalServerErrorCodes = require('../functions/internalServerErrorCodes');
const jwt = require('jsonwebtoken');
const CustomResponse = require('../helpers/CustomResponse');

const AnnouncementLikes = require('../models/AnnouncementLikes');
const announcement_likes = new AnnouncementLikes("announcement_likes");

exports.getPublicAnnouncementLikes = function (req, res, next, callback = function () {
}) {
    this.callback = callback;
    this.user_id = req.params.userId;
    try {
        announcement_likes.query("select * from announcement_likes where user_id = " + this.user_id + " ", function (err, row, fields) {
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

exports.postPrivateAnnouncementLikes = function (req, res, next, callback = function () {
}) {
    this.callback = callback;
    this.user_id = req.body.userId;
    try {
        announcement_likes.query("select * from announcement_likes where user_id = " + this.user_id + " ", function (err, row, fields) {
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

exports.postPrivateAddLike = function (req, res, next, callback = function () {
}) {
    this.callback = callback;
    this.user_id = req.body.userId || 0;
    this.announcement_id = req.body.announcement_id || 0;
    try {
        announcement_likes.query("INSERT INTO announcement_likes (user_id, announcement_id) VALUES(" + this.user_id + "," + this.announcement_id + ")", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            } else {
                if (row.affectedRows >= 1) {
                    status = new InternalServerErrorCodes().errorCodes(0);
                    new CustomResponse(res, req, status, 200);
                } else {
                    status = new InternalServerErrorCodes().errorCodes(-3);
                    new CustomResponse(res, req, status, 500);
                }
            }

        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postPrivateRemoveLike = function (req, res, next, callback = function () {
}) {
    this.callback = callback;
    this.user_id = req.body.userId || 0;
    this.announcement_id = req.body.announcement_id || 0;
    try {
        announcement_likes.query("DELETE FROM announcement_likes WHERE user_id = " + this.user_id + "  and announcement_id = " + this.announcement_id + " ", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            } else {
                if (row.affectedRows >= 1) {
                    status = new InternalServerErrorCodes().errorCodes(0);
                    console.log(status);
                    new CustomResponse(res, req, status, 200);
                } else {
                    status = new InternalServerErrorCodes().errorCodes(-3);
                    console.log(status);
                    new CustomResponse(res, req, status, 500);
                }
            }

        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(e.code);
        new CustomResponse(res, req, status, 500);
    }
};