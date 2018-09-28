const MyAppModel = require('../database/DbConnection');

class Announcement {
    constructor(params){
        this.announcements = null;
        this.extends = params;
        this.init();
    }

    init(){
        const Announcement = MyAppModel.extend({
            tableName: this.extends
        });
        this.announcements = new Announcement();
    }

    query(query, callback){
        this.announcements.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = Announcement;