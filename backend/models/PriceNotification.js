const mongoose = require('mongoose');
const { Schema } = mongoose;

// in-app message shown when a tracked product reaches the target price
const PriceNotificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
    message: {
        type: String,
        required: true,
    },
    oldPrice: Number,
    newPrice: Number,
    targetPrice: Number,
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

module.exports = mongoose.model("pricenotification", PriceNotificationSchema)
