const MyAppModel = require('../database/DbConnection');

class Conversation {
    constructor(params){
        this.conversations = null;
        this.extends = params;
        this.init();
    }

    init(){
        const Conversation = MyAppModel.extend({
            tableName: this.extends
        });
        this.conversations = new Conversation();
    }

    query(query, callback){
        this.conversations.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = Conversation;