const MyAppModel = require('../database/DbConnection');

class UserType {
    constructor(params){
        this.user_types = null;
        this.extends = params;
        this.init();
    }

    init(){
        const UserType = MyAppModel.extend({
            tableName: this.extends
        });
        this.user_types = new UserType();
    }

    query(query, callback){
        this.user_types.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = UserType;