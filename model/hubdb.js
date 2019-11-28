/**
 * Created by hylas on 2018/8/9.
 */
var randomstring = require("randomstring");
const mongo = require("./mongo");


const TradeInfo = mongo.exchangeDB.model('trade', {
    "_id": String,
    "orderId": String,
    "coinType": String,
    "type": String,
    "price": Number,
    "amount": Number,
    "dt": Date,
    "userId": String,
    "userNameChain": String,
    "state": Number,
    "noFilled": Number,
    "priceFilled":   //String,  
    {
        type: Number,
        get: v => Number(v || 0.0).toFixed(6)
    },
    "__v": Number
});


const TradePair = mongo.mongoose.model('tradepair', {
    "_id": String,
    "code": String,
    "type": Number,
    "enable": Number,
    "pricePrecision": Number,
    "amountPrecision": Number,
    "totalPrecision": Number,
    "minprice": Number,
    "minamount": Number
}
);

const Withdraw = mongoose.model('withdraw', {
    "_id": String,
    "id": Number,
    "reqid": Number,
    "user": String,
    "to": String,
    "quantity": String,
    "txhash": String,
    "status": Number,
    "executor": String,
    "blocknum": Number,
    "timestamp": String
});

const Deposit = mongoose.model('deposit', {
    "_id": String,
    "id": Number,
    "user": String,
    "from": String,
    "quantity": String,
    "txhash": String,
    "timestamp": String,
    "is_valid": Number
});


const KeyInfo = mongoose.model('key', {
    "_id": String,
    "keyInfo":
    {
        masterPrivateKey: String,
        privateKeys:
        {
            owner: String,
            active: String
        },
        publicKeys:
        {
            owner: String,
            active: String
        }
    },
    "isUsed": Number
});

const Data_Rec = mongoose.model('data_rec', {
    "_id": String,
    "orderId": String,
    "data": String,
    "name": String,
    "dataEx": { "age": Number, "name": String }

});


// { 
//     "_id" : ObjectId("1452ddec538376005c0d5dd8"), 
//     "act" : {
//         "data" : {
//             "scope" : "7966354686456365056", 
//             "request_id" : NumberInt(53501256), 
//             "amount" : NumberInt(1027000000), 
//             "price" : "0.10030000000000000"
//         }
//     }, 
//     "block_num" : NumberInt(4080383), 
//     "block_time" : "2019-11-19T14:27:45.000"
// }
//collection action_traces
const ActionTrace = eosDB.model('action_trace', {
    "_id": String,
    "block_num": Number,
    "block_time": String,
    "act": { "data": { "scope": String, "request_id": Number, "amount": Number, "price": String } }

});


initdb = function () {

};

closedb = function () {

};

insertData = function (data, callback) {
    data._id = randomstring.generate(12);
    let rec = new Data_Rec(data);
    rec.orderId = 'sdfsdf';
    rec.save().then(() => {
        if (env.NODE_ENV && env.NODE_ENV !== 'production')
            console.log('insertData ok ');
        if (callback) callback('', 'insertData ok');

    }).catch((err, res) => {
        if (callback) callback('error', err);
    })
};

deleteData = function (key) {

    Data_Rec.deleteOne({ _id: "KGai01je4a4E" }, (err, data) => {
        if (env.NODE_ENV && env.NODE_ENV !== 'production')
            console.log(err, data)
    })

};

updateData = function (data) {

    //let rec = new Data_Rec(  data  );

    Data_Rec.update({ _id: "hgBAQHV8kxdu" }, { name: "zhangyong" }, (err, data) => {
        console.log(err, data)
    })

};

selectData = function (orderId, callback) {
    Data_Rec.find({ orderId: orderId }, function (err, recs) {
        if (err) return console.error(err);
        //console.log(  recs );
    })
};

selectDatas = function (name, callback) {
    Data_Rec.find({ name: name }, function (err, recs) {
        if (err) return console.error(err);
        //console.log(  recs );
    })
};


getUser = function (username) {

};

setUser = function (username, userObj) {

};

///////////////////////////////////// withdrawals deposit 操作///////////////////////////////////////
//Deposit Withdraw
insertDepositRec = function (data, callback) {
    data._id = randomstring.generate(12);
    let rec = new Deposit(data);
    rec.save().then(() => {
        if (callback) callback('', 'insertData ok');
    }).catch((err, res) => {
        if (callback) callback('error', err);
    })
};

insertWithdrawRec = function (data, callback) {
    data._id = randomstring.generate(12);
    let rec = new Withdraw(data);
    rec.save().then(() => {
        // console.log( 'insertData ok ');
        if (callback) callback('', 'insertData ok');

    }).catch((err, res) => {
        if (callback) callback('error', err);
    })
};

///////////////////////////////////// TradePair 操作/////////////////////////////////////////////////

getTradeParis = function (callback) {
    TradePair.find({ "enable": 1 }, function (err, recs) {
        if (err) {
            callback(err, '')

        }
        //console.log(recs);
        if (recs.length > 0)
            callback('', recs);
        else
            callback('[]', '')
    })

};

///////////////////////////////////// trade 操作/////////////////////////////////////////////////

getUserATrade = function (order_id, callback) {
    TradeInfo.find({ orderId: order_id }, function (err, recs) {
        if (err) {
            callback(err, '')

        }
        //console.log(recs);
        if (recs.length > 0)
            callback('', recs[0]);
        else
            callback('[]', '')

    })

};

getUserTradesByUserid = function (userId, callback) {

    TradeInfo.find({ userId: userId }, function (err, recs) {
        if (err) {
            callback(err, '');
            return console.error(err);

        }

        callback('', recs);
        return recs
    })

};

getUserTradesByChainName = function (usernameChain, callback) {

    TradeInfo.find({ userNameChain: usernameChain }, function (err, recs) {

        if (err) {
            console.log('trades', err);
            callback(err, '');
            return console.error(err);
        }

        callback('', recs);
        return recs

    })

};


insertUserATrade = function (trade, callback) {

    trade._id = randomstring.generate(12);


    let rec = new TradeInfo(trade);

    rec.save().then(() => {
        if (env.NODE_ENV && env.NODE_ENV !== 'production')
            console.log('insertData ok ');
        if (callback) callback('', 'insertData ok');

    }).catch((err, res) => {
        if (callback) callback('error', err);
    })

};


setUserATrade = function (trade) {

    TradeInfo.update({ orderId: trade.orderId }, { state: trade.state, noFilled: trade.noFilled, priceFilled: trade.priceFilled }, (err, data) => {
        if (env.NODE_ENV && env.NODE_ENV !== 'production')
            console.log(err, data)
    })

};

//////////////////////////////////////////////////////////////////

insertKeyInfo = function (keyInfo, callback) {

    //KeyInfo

    let rec = new KeyInfo();
    rec._id = randomstring.generate(12);
    rec.keyInfo = keyInfo;
    rec.isUsed = 0;

    rec.save().then(() => {
        // console.log( 'insertData ok ');
        if (callback) callback('', 'insertData ok');

    }).catch((err, res) => {
        if (callback) callback('error', err);
    })

};

//////////////////////////////////////////////////////////////////
//从数据库获取行情
getHisPrices = function (scope, size, callback) {
    console.log("in db getHisPrices")
    // MyModel.find({}).sort({'_id':-1}).limit(6).exec(function(err,docs){})
    ActionTrace.find({ "act.name": "updateprice", "act.data.scope": scope }, { "block_num": 1, "block_time": 1, "act.data": 1 })
        .sort({ block_num: -1 })
        .limit(size)
        .exec(
            function (err, recs) {
                // console.log("find() over :",err, recs )
                if (err) {
                    callback(err, '')
                }
                //console.log(recs);
                if (recs.length > 0)
                    callback('', recs);
                else
                    callback('[]', '')
            }
        )
};



module.exports.getUserATrade = getUserATrade;
module.exports.setUserATrade = setUserATrade;
module.exports.getUserTradesByUserid = getUserTradesByUserid;
module.exports.getUserTradesByChainName = getUserTradesByChainName;
module.exports.insertUserATrade = insertUserATrade;
module.exports.insertKeyInfo = insertKeyInfo;
module.exports.getTradeParis = getTradeParis;
module.exports.insertDepositRec = insertDepositRec;
module.exports.insertWithdrawRec = insertWithdrawRec;
module.exports.getHisPrices = getHisPrices;

