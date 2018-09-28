const User = require('../models/User');
const Image = require('../models/Image');
const InternalServerErrorCodes = require('../functions/internalServerErrorCodes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CustomResponse = require('../helpers/CustomResponse');
const checkUndefined = require('../functions/check-input');


exports.getPublicAllUsers = function (req, res, next) {
    const user = new User("user");
    try {
        user.query("select * from user", function (err, row, fields) {
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

exports.postPrivateAllUsers = function (req, res, next) {
    const user = new User("user");
    try {
        user.query("select * from user", function (err, row, fields) {
            let status = 0;
            if (err) {
                status = new InternalServerErrorCodes().mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500, row);
            }
            status = new InternalServerErrorCodes().errorCodes(status);
            new CustomResponse(res, req, status, 200, row);
        });
    } catch (e) {
        status = new InternalServerErrorCodes().errorCodes(status);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postLogin = function (req, res, next) {
    const user = new User("user");
    const image = new Image('image');
    const internalErrorStatusMessage = new InternalServerErrorCodes();
    try {
        const ob = {
            email: req.body.email,
            password: req.body.password
        };
        if (checkUndefined(ob)) {
            status = internalErrorStatusMessage.errorCodes(-2);
            new CustomResponse(res, req, status, 400);
        } else {
            user.findOneByEmail(ob, function (error, row) {
                let status = "";
                if (error) {
                    console.log(error.message);
                    status = internalErrorStatusMessage.mySqlErrorCodes(error.code);
                    new CustomResponse(res, req, status, 500);
                } else {
                    let password = ob.password;
                    bcrypt.compare(password, row.password, function (err, exists) {
                        if (err) {
                            status = internalErrorStatusMessage.errorCodes(-1);
                            new CustomResponse(res, req, status, 403);
                        } else {
                            if (exists === true) {
                                const jwt_token = jwt.sign({email: row.email, user_id: row.id},
                                    process.env.JWT_KEY,
                                    {expiresIn: process.env.JWT_KEY_EXPIRE_TIME}
                                );
                                let ob = {};
                                ob.user = {
                                    token: jwt_token,
                                    id: row.id,
                                    email: row.email,
                                    name: row.name,
                                    surname: row.surname,
                                    birthdate: row.birthdate,
                                    mobile_tel: row.mobile_tel,
                                    image_id: row.image_id,
                                    country: row.country,
                                    user_type: row.user_type,
                                    date_created: row.date_created,
                                    date_updated: row.date_updated
                                };
                                console.log(ob.user.image_id);
                                image.query("select * from image where id = '" + ob.user.image_id + "' ", function (err, row1, fields) {
                                    console.log(row1);
                                    console.log(row1);
                                    if (err) {
                                        status = internalErrorStatusMessage.errorCodes(-1);
                                        ob.user_image = {};
                                        new CustomResponse(res, req, status, 500);
                                    } else {
                                        console.log(row1);
                                        ob.user_image = row1;
                                        status = internalErrorStatusMessage.errorCodes(0);
                                        new CustomResponse(res, req, status, 200, ob);
                                    }
                                });

                            } else {
                                status = internalErrorStatusMessage.errorCodes(-1);
                                new CustomResponse(res, req, status, 403);
                            }
                        }
                    });
                }
            });
        }
    } catch (e) {
        status = internalErrorStatusMessage.errorCodes(-2);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postSignup = function (req, res, next) {
    let status = null;
    const user = new User("user");
    const internalErrorStatusMessage = new InternalServerErrorCodes();
    try {
        const attributes = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            birthdate: req.body.birthdate,
            mobile_tel: req.body.mobile_tel,
            image_id: 1,
            country: 'unknown',
            user_type: 2,
            date_created: new Date()
        };
        // Check if the requests variables are sent to server
        if (checkUndefined(attributes)) {
            status = internalErrorStatusMessage.errorCodes(-2);
            new CustomResponse(res, req, status, 400);
        } else {
            //Hashing the password using BCRYPT
            // process.env.BCRYPT_HASH_LENGTH
            bcrypt.hash(attributes.password, 10, function (err, hash) {
                if (err) {
                    // password cannot be hashed
                    console.log(err.code);
                    status = internalErrorStatusMessage.mySqlErrorCodes(err.code);
                    new CustomResponse(res, req, status, 500);
                } else {
                    // password can be hashed
                    attributes.password = hash;
                    //Save the user in database
                    user.save(attributes, function (err, results) {
                        if (err) {
                            status = internalErrorStatusMessage.mySqlErrorCodes(err.code);
                            new CustomResponse(res, req, status, 400);
                        } else {
                            if (results.affectedRows >= 1) {
                                status = internalErrorStatusMessage.errorCodes(0);
                                new CustomResponse(res, req, status, 200);
                            } else {
                                status = internalErrorStatusMessage.errorCodes(-1);
                                new CustomResponse(res, req, status, 401);
                            }
                        }
                    });
                }
            });
        }
    } catch (e) {
        status = internalErrorStatusMessage.mySqlErrorCodes(-2);
        new CustomResponse(res, req, status, 500);
    }
};

exports.postPrivateUpdateUser = function (req, res, next) {
    var self = this;
    console.log("LOL");
    console.log(req.file);
    let status = null;
    const user = new User("user");
    const image = new Image('image');
    const internalErrorStatusMessage = new InternalServerErrorCodes();
    try {
        const attributes = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            birthdate: req.body.birthdate,
            mobile_tel: req.body.mobile_tel,
            image: req.file
        };

        console.log(attributes);
        image.query("INSERT INTO image (image) values ('http://localhost:4500/images/" + attributes.image.filename + "')", function (err, row, fields) {
            let image_id = row.insertId;
            if (err) {
                console.log(err.code);
                status = internalErrorStatusMessage.mySqlErrorCodes(err.code);
                new CustomResponse(res, req, status, 500);
            } else {
                console.log("IMAGE INSERTED");
                bcrypt.hash(attributes.password, 10, function (err, hash) {
                    if (err) {
                        // password cannot be hashed
                        console.log(err.code);
                        console.log(err.message);
                        status = internalErrorStatusMessage.mySqlErrorCodes(err.code);
                        //new CustomResponse(res, req, status, 500);
                    } else {
                        console.log("PASSWORD HASHED");
                        user.query("UPDATE user set password = '" + hash + "' , name = '" + attributes.name + "' , surname = '" + attributes.surname + "', birthdate = '" + attributes.birthdate + "' , mobile_tel = '" + attributes.mobile_tel + "' , image_id = '" + image_id + "' where email = '" + attributes.email + "' ", function (err, row, fields) {
                            if (err) {
                                console.log(err.code);
                                status = internalErrorStatusMessage.mySqlErrorCodes(err.code);
                                new CustomResponse(res, req, status, 500);
                            } else {
                                status = internalErrorStatusMessage.errorCodes(0);
                                new CustomResponse(res, req, status, 200);
                            }
                        });
                    }
                });
            }
        });
    }
    catch
        (e) {
        status = internalErrorStatusMessage.mySqlErrorCodes(-2);
        new CustomResponse(res, req, status, 500);
    }
};