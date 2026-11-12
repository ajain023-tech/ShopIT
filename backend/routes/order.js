const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const authUser = require('../middleware/authUser');

// free delivery on orders of ₹999 or more, otherwise ₹99
const FREE_SHIPPING_ABOVE = 999;
const SHIPPING_CHARGE = 99;
const getShippingCharge = (itemsTotal) => itemsTotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_CHARGE;

// place an order with everything in the user's cart, then empty the cart
router.post('/placeorder', authUser, async (req, res) => {
    try {
        const { userDetails } = req.body;
        const cartItems = await Cart.find({ user: req.user.id })
            .populate("productId", "name price originalPrice image rating type brand category");

        if (cartItems.length === 0) {
            return res.status(400).send("Your cart is empty");
        }

        // skip items whose product no longer exists
        const validItems = cartItems.filter(item => item.productId);
        if (validItems.length === 0) {
            return res.status(400).send("Your cart is empty");
        }
        const itemsTotal = validItems.reduce(
            (sum, item) => sum + item.productId.price * item.quantity, 0);
        const shippingCharge = getShippingCharge(itemsTotal);

        const order = await Order.create({
            user: req.user.id,
            productData: validItems.map(item => item.toObject()),
            userData: userDetails,
            totalAmount: itemsTotal + shippingCharge,
            shippingCharge,
        });

        await Cart.deleteMany({ user: req.user.id });
        res.send(order);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// all previous orders of the logged in user, newest first
router.get('/getPreviousOrders', authUser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.send(orders);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// cancel an order of the logged in user while it is still "Placed"
router.put('/cancel/:id', authUser, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send("Order not found");
        }
        const order = await Order.findOne({ _id: id, user: req.user.id });
        if (!order) {
            return res.status(404).send("Order not found");
        }
        if (order.status !== 'Placed') {
            return res.status(400).send("This order can no longer be cancelled");
        }
        order.status = 'Cancelled';
        await order.save();
        res.send(order);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

module.exports = router
