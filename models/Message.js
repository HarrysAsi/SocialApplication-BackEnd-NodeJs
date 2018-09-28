const MyAppModel = require('../database/DbConnection');

class Message {
    constructor(params){
        this.messages = null;
        this.extends = params;
        this.init();
    }

    init(){
        const Message = MyAppModel.extend({
            tableName: this.extends
        });
        this.messages = new Message();
    }

    query(query, callback){
        this.messages.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = Message;