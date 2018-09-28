const MyAppModel = require('../database/DbConnection');

class AnnouncementLikes {
    constructor(params){
        this.announcement_likes = null;
        this.extends = params;
        this.init();
    }

    init(){
        const AnnouncementLikes = MyAppModel.extend({
            tableName: this.extends
        });
        this.announcement_likes = new AnnouncementLikes();
    }

    query(query, callback){
        this.announcement_likes.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = AnnouncementLikes;