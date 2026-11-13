const User = require("../models/User");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Order = require("../models/Order");
const PriceAlert = require("../models/PriceAlert");
const PriceNotification = require("../models/PriceNotification");

// deletes the logged in user along with their cart, wishlist, orders and price alerts
const deleteAllUserData = async (req, res) => {
    const userId = req.user.id;
    try {
        const findUser = await User.findById(userId)
        if (!findUser) {
            return res.status(400).send("User Not Found")
        }
        await User.findByIdAndDelete(userId);
        await Cart.deleteMany({ user: userId });
        await Wishlist.deleteMany({ user: userId });
        await Order.deleteMany({ user: userId });
        await PriceAlert.deleteMany({ user: userId });
        await PriceNotification.deleteMany({ user: userId });
        res.send("delete successfully")
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
}
module.exports = { deleteAllUserData }
