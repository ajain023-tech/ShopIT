const mongoose = require('mongoose');
const { Schema } = mongoose;

// a product the user is tracking, with the price they are waiting for
const PriceAlertSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    targetPrice: {
        type: Number,
        required: true,
    },
    // price when the user started tracking
    startPrice: {
        type: Number,
    },
    // set once the price reaches the target, so the user is told only once
    notified: {
        type: Boolean,
        default: false,
    },
    notifiedAt: {
        type: Date,
    },
}, { timestamps: true })

PriceAlertSchema.index({ user: 1, product: 1 }, { unique: true })

module.exports = mongoose.model("pricealert", PriceAlertSchema)
