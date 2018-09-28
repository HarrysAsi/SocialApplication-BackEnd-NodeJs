const MyAppModel = require('../database/DbConnection');

class FriendStatus {
    constructor(params){
        this.friend_status = null;
        this.extends = params;
        this.init();
    }

    init(){
        const FriendStatus = MyAppModel.extend({
            tableName: this.extends
        });
        this.friend_status = new FriendStatus();
    }

    query(query, callback){
        this.friend_status.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = FriendStatus;