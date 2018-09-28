const Message = require('../models/Message');
const InternalServerErrorCodes = require('../functions/internalServerErrorCodes');
const CustomResponse = require('../helpers/CustomResponse');
const checkUndefined = require('../functions/check-input');


exports.postPrivateAllMessages = function (req, res, next) {
    const messages = new Message("message");
    try {
        const conversation_id = req.body.conversation_id || 0;
        messages.query("select * from message, conversation_messages where message.id = conversation_messages.message_id and conversation_messages.conversation_id = " + conversation_id + " GROUP BY message.sent_date", function (err, row, fields) {
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