const MyAppModel = require('../database/DbConnection');

class Image {
    constructor(params){
        this.image = null;
        this.extends = params;
        this.init();
    }

    init(){
        const Image = MyAppModel.extend({
            tableName: this.extends
        });
        this.image = new Image();
    }

    query(query, callback){
        this.image.query(query, function(err, rows, fields){
            callback(err, rows, fields);
        });
    }
}

module.exports = Image;