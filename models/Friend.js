const MyAppModel = require('../database/DbConnection');

class Friend {
    constructor(params){
        this.friend_status = null;
        this.extends = params;
        this.init();
    }

    init(){
        const Friends = MyAppModel.extend({
            tableName: this.extends
        });
        this.friends = new Friends();
    }

    query(query, callback){
        this.friends.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = Friend;