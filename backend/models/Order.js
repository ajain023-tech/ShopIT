const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    // copy of the cart items at the time of ordering
    productData: {
        type: Array,
        required: true,
    },
    // name, phone and shipping address entered on checkout
    userData: {
        type: Object,
        required: true,
    },
    totalAmount: {
        type: Number,
    },
}, { timestamps: true })

module.exports = mongoose.model("order", OrderSchema)
