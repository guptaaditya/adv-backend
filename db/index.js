const mongoose = require('mongoose');
const initializeAllModels = require('./models');

class Mongo {
    static connection = null;

    static async getConnection() {
        if (!Mongo.connection) {
            mongoose.connect(
                'mongodb://localhost/utv',
                { useNewUrlParser: true, useUnifiedTopology: true }
            ).then(conn => {
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