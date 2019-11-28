module.exports = app => {
    const mongoose = app.mongoose;
    const TradePairsSchema = new mongoose.Schema({
        code: String,
        type: Number,
        enable: Number,
        pricePrecision: Number,
        amountPrecision: Number,
        totalPrecision: Number,
        minprice: Number,
        minamount: Number,
    });
    return mongoose.model('TradePairs', TradePairsSchema, 'tradepairs');
};