const mongoose = require('mongoose');

//const dbURL = process.env.SOCKET_MONGODB_URL || 'mongodb://127.0.0.1:27017/bank';
const dbURL = process.env.SOCKET_MONGODB_URL || 'mongodb://test.mongodb.hubdex.io/bank';

mongoose.connect(dbURL, {
        db: {native_parser: true},
        server: {poolSize: 5, auto_reconnect: true, socketOptions: { keepAlive: 1 }},
        useNewUrlParser: true,
    }
);

// hack we have to use the exchange db for trades
const exchangeDB = mongoose.connection.useDb('hub');
const eosDB = mongoose.connection.useDb('EOS');

module.exports.mongoose = mongoose;
module.exports.exchangeDB = exchangeDB;
module.exports.eosDB = eosDB;


