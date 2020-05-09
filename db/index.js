const mongoose = require('mongoose');
const initializeAllModels = require('./models');

class Mongo {
    static connection = null;

    static async getConnection() {
        if (!Mongo.connection) {
            const user = process.env.DB_USER;
            const pwd = process.env.DB_USER_PWD;
            let connectAuth = '';
            if(user && pwd) {
                connectAuth = `${user}:${encodeURIComponent(pwd)}@`;
            }
            let port = process.env.DB_PORT;
            port = port ? `:${port}`: '';
            
            const dbName = process.env.DB_NAME || '';
            const connectionString = `mongodb://${connectAuth}localhost${port}/${dbName}`;

            mongoose.connect(
                connectionString,
                { useNewUrlParser: true, useUnifiedTopology: true }
            ).then(conn => {
                console.log('Connected Mongo');
                Mongo.connection = conn;
            });
        }
    }
};

let initDb = function() {
    Mongo.getConnection();
    return initializeAllModels(mongoose);
};

module.exports = initDb();