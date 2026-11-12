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
    shippingCharge: {
        type: Number,
        default: 0,
    },
    couponCode: {
        type: String,
        default: '',
    },
    couponDiscount: {
        type: Number,
        default: 0,
    },
    paymentMethod: {
        type: String,
        default: 'Cash on Delivery',
    },
    status: {
        type: String,
        default: 'Placed',
    },
}, { timestamps: true })

module.exports = mongoose.model("order", OrderSchema)
