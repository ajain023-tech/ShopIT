// Demo helper for the Price Drop Tracker.
// Usage:
//   node simulatePriceDrop.js                      -> drops every tracked product to its lowest target price
//   node simulatePriceDrop.js <productId> <price>  -> sets one product to the given price
require('dotenv').config();
const mongoose = require('mongoose');
const PriceAlert = require('./models/PriceAlert');
const { changePrice } = require('./helpers/priceTracker');

async function run() {
    await mongoose.connect(process.env.MONGO_URL);
    const [productId, price] = process.argv.slice(2);

    const changes = [];
    if (productId) {
        if (!Number(price)) throw new Error('Usage: node simulatePriceDrop.js <productId> <price>');
        changes.push({ productId, price: Number(price) });
    } else {
        const alerts = await PriceAlert.find({ notified: false });
        const lowestTarget = {};
        alerts.forEach(alert => {
            const id = String(alert.product);
            lowestTarget[id] = Math.min(lowestTarget[id] ?? Infinity, alert.targetPrice);
        });
        Object.entries(lowestTarget).forEach(([id, target]) => changes.push({ productId: id, price: target }));
    }

    if (changes.length === 0) console.log('Nothing to change: no tracked product is waiting for a price drop.');
    for (const change of changes) {
        const { product, oldPrice, notified } = await changePrice(change.productId, change.price);
        console.log(`${product.name}: ₹${oldPrice} -> ₹${product.price} (${notified} user(s) notified)`);
    }
    await mongoose.disconnect();
}

run().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
