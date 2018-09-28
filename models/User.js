const MyAppModel = require('../database/DbConnection');

class User {
    constructor(params) {
        this.user = null;
        this.extends = params;
        this.init();
    }

    init() {
        const User = MyAppModel.extend({
            tableName: this.extends
        });
        this.user = new User();
    }

    //Save a model to database
    save(params, callback) {
        const User = MyAppModel.extend({
            tableName: this.extends
        });
        new User(params).save(function(error, results){
            callback(error,results);
        });
    }
    findOneByEmail(params, callback) {
        console.log(params);
        this.user.find('first', {where: "email = '" + params.email + "' "}, function (error, row) {
            callback(error, row);
        });
    }

    //Execute any query
    query(query, callback) {
        this.user.query(query, function (err, rows, fields) {
            callback(err, rows, fields);
        });
    }
}

module.exports = User;