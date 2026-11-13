const mongoose = require('mongoose');
const { Schema } = mongoose;

// one entry every time the price of a product changes
const PriceHistorySchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
    },
    recordedAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("pricehistory", PriceHistorySchema)
