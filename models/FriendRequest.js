const MyAppModel = require('../database/DbConnection');

class FriendRequest {
    constructor(params){
        this.friend_request = null;
        this.extends = params;
        this.init();
    }

    init(){
        const FriendRequest = MyAppModel.extend({
            tableName: this.extends
        });
        this.friend_request = new FriendRequest();
    }

    query(query, callback){
        this.friend_request.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = FriendRequest;