const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const PriceAlert = require('../models/PriceAlert');
const PriceNotification = require('../models/PriceNotification');

const formatPrice = (amount) => '₹' + Math.round(Number(amount) || 0).toLocaleString('en-IN');

// add a history entry, but only if the price is different from the last one
const recordPrice = async (productId, price, recordedAt = new Date()) => {
    const last = await PriceHistory.findOne({ product: productId }).sort({ recordedAt: -1 });
    if (last && last.price === price) return last;
    return PriceHistory.create({ product: productId, price, recordedAt });
};

// tell every user whose target price has been reached (once per alert)
const notifyTrackers = async (product, oldPrice) => {
    const alerts = await PriceAlert.find({
        product: product._id,
        notified: false,
        targetPrice: { $gte: product.price },
    });

    for (const alert of alerts) {
        await PriceNotification.create({
            user: alert.user,
            product: product._id,
            message: `Price drop! ${product.name} is now ${formatPrice(product.price)} (your target was ${formatPrice(alert.targetPrice)})`,
            oldPrice: oldPrice ?? alert.startPrice,
            newPrice: product.price,
            targetPrice: alert.targetPrice,
        });
        alert.notified = true;
        alert.notifiedAt = new Date();
        await alert.save();
    }
    return alerts.length;
};

// the one place that changes a product's price: saves it, records history, notifies trackers
const changePrice = async (productId, newPrice) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    const oldPrice = product.price;
    product.price = Math.round(newPrice);
    await product.save();
    await recordPrice(product._id, product.price);
    const notified = await notifyTrackers(product, oldPrice);
    return { product, oldPrice, notified };
};

// sample price history for the demo catalog: a few price changes over the last 90 days,
// moving between the selling price and the MRP and ending at today's price
const buildSampleHistory = (product, index) => {
    const DAY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const mrp = product.originalPrice && product.originalPrice > product.price ? product.originalPrice : product.price * 1.2;
    // small deterministic "random" so every seed gives the same chart
    let seed = (index + 1) * 9301;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
    const roundTo9 = (value) => Math.max(9, Math.round(value / 10) * 10 - 1);

    const points = [];
    let day = 90;
    while (day > 0) {
        const share = random(); // 0 = selling price, 1 = MRP
        const price = roundTo9(product.price + (mrp - product.price) * share * 1.1 - product.price * 0.06 * random());
        points.push({ product: product._id, price, recordedAt: new Date(now - day * DAY) });
        day -= 4 + Math.floor(random() * 9);
    }
    points.push({ product: product._id, price: product.price, recordedAt: new Date(now) });
    // keep only real changes
    return points.filter((point, i) => i === 0 || point.price !== points[i - 1].price);
};

module.exports = { recordPrice, notifyTrackers, changePrice, buildSampleHistory };
