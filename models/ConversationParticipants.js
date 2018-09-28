const MyAppModel = require('../database/DbConnection');

class ConversationParticipants {
    constructor(params){
        this.conversation_participants = null;
        this.extends = params;
        this.init();
    }

    init(){
        const ConversationParticipants = MyAppModel.extend({
            tableName: this.extends
        });
        this.conversation_participants = new ConversationParticipants();
    }

    query(query, callback){
        this.conversation_participants.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = ConversationParticipants;