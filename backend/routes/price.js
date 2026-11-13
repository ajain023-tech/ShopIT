const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const PriceAlert = require('../models/PriceAlert');
const PriceNotification = require('../models/PriceNotification');
const authUser = require('../middleware/authUser');
const { recordPrice } = require('../helpers/priceTracker');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const PRODUCT_FIELDS = 'name price originalPrice image type brand rating';

// price history of a product (oldest first) with lowest / highest / average
router.get('/history/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        if (!isValidId(productId)) {
            return res.status(400).json({ msg: 'Invalid product id' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        // make sure today's price is always the last point
        await recordPrice(product._id, product.price);

        const history = await PriceHistory.find({ product: product._id }).sort({ recordedAt: 1 });
        const prices = history.map(entry => entry.price);
        res.send({
            history: history.map(entry => ({ price: entry.price, date: entry.recordedAt })),
            stats: {
                current: product.price,
                lowest: Math.min(...prices),
                highest: Math.max(...prices),
                average: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
            },
        });
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// start tracking a product, or change the target price
router.post('/track', authUser, async (req, res) => {
    try {
        const { productId } = req.body;
        const targetPrice = Math.round(Number(req.body.targetPrice));
        if (!isValidId(productId)) {
            return res.status(400).json({ msg: 'Invalid product id' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
            return res.status(400).json({ msg: 'Please enter a valid target price' });
        }
        if (targetPrice >= product.price) {
            return res.status(400).json({ msg: 'Target price must be lower than the current price' });
        }

        const alert = await PriceAlert.findOneAndUpdate(
            { user: req.user.id, product: product._id },
            {
                targetPrice,
                notified: false,
                $unset: { notifiedAt: 1 },
                $setOnInsert: { startPrice: product.price },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).populate('product', PRODUCT_FIELDS);
        res.send(alert);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// all products the logged in user is tracking
router.get('/tracked', authUser, async (req, res) => {
    try {
        const alerts = await PriceAlert.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('product', PRODUCT_FIELDS);
        // skip alerts whose product no longer exists
        res.send(alerts.filter(alert => alert.product));
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// stop tracking a product
router.delete('/track/:productId', authUser, async (req, res) => {
    try {
        const { productId } = req.params;
        if (!isValidId(productId)) {
            return res.status(400).json({ msg: 'Invalid product id' });
        }
        const alert = await PriceAlert.findOneAndDelete({ user: req.user.id, product: productId });
        if (!alert) {
            return res.status(404).json({ msg: 'You are not tracking this product' });
        }
        res.send({ success: true });
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// latest price drop notifications of the logged in user
router.get('/notifications', authUser, async (req, res) => {
    try {
        const notifications = await PriceNotification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('product', 'name image type price');
        res.send(notifications);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// mark all notifications of the logged in user as read
router.put('/notifications/read', authUser, async (req, res) => {
    try {
        await PriceNotification.updateMany({ user: req.user.id, read: false }, { read: true });
        res.send({ success: true });
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
