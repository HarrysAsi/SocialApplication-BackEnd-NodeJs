const mysqlModel = require('mysql-model');

const MyAppModel = mysqlModel.createConnection({
    host: process.env.DATABASE_HOST ,
    user: process.env.DATABASE_USER ,
    password: process.env.DATABASE_PASSWORD ,
    database:  process.env.DATABASE_NAME
});


module.exports = MyAppModel;
