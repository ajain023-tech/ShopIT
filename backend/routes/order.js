const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const authUser = require('../middleware/authUser');

const SHIPPING_CHARGE = 100;

// place an order with everything in the user's cart, then empty the cart
router.post('/placeorder', authUser, async (req, res) => {
    try {
        const { userDetails } = req.body;
        const cartItems = await Cart.find({ user: req.user.id })
            .populate("productId", "name price image rating type");

        if (cartItems.length === 0) {
            return res.status(400).send("Your cart is empty");
        }

        const itemsTotal = cartItems.reduce(
            (sum, item) => sum + item.productId.price * item.quantity, 0);

        const order = await Order.create({
            user: req.user.id,
            productData: cartItems.map(item => item.toObject()),
            userData: userDetails,
            totalAmount: itemsTotal + SHIPPING_CHARGE,
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

module.exports = router
