const MyAppModel = require('../database/DbConnection');

class FriendType {
    constructor(params){
        this.friend_type = null;
        this.extends = params;
        this.init();
    }

    init(){
        const FriendType = MyAppModel.extend({
            tableName: this.extends
        });
        this.friend_type = new FriendType();
    }

    query(query, callback){
        this.friend_type.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = FriendType;