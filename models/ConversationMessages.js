const MyAppModel = require('../database/DbConnection');

class ConversationMessages {
    constructor(params){
        this.conversation_messages = null;
        this.extends = params;
        this.init();
    }

    init(){
        const ConversationMessages = MyAppModel.extend({
            tableName: this.extends
        });
        this.conversation_messages = new ConversationMessages();
    }

    query(query, callback){
        this.conversation_messages.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = ConversationMessages;