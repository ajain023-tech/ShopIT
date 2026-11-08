const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authUser = require("../middleware/authUser");

// get all cart products
router.get("/fetchcart", authUser, async (req, res) => {
    try {
        const cart = await Cart.find({ user: req.user.id })
            .populate("productId", "name price originalPrice image rating type brand category")
            .populate("user", "name email");
        res.send(cart);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// add to cart

router.post("/addcart", authUser, async (req, res) => {
    try {
        const { _id, quantity } = req.body;
        const findProduct = await Cart.findOne({ $and: [{ productId: _id }, { user: req.user.id }] })
        if (findProduct) {
            return res.status(400).json({ msg: "Product already in a cart" })
        }
        else {
            const user = req.header;
            const cart = new Cart({
                user: req.user.id,
                productId: _id,
                quantity,
            });
            const savedCart = await cart.save();
            res.send(savedCart);
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// change quantity of a cart item (1 to 10)
router.put("/updatecart/:id", authUser, async (req, res) => {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return res.status(400).json({ msg: "Quantity must be between 1 and 10" });
    }
    try {
        const item = await Cart.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: { quantity } },
            { new: true }
        ).populate("productId", "name price originalPrice image rating type brand category");
        if (!item) {
            return res.status(404).json({ msg: "Cart item not found" });
        }
        res.send(item);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// remove from cart
router.delete("/deletecart/:id", authUser, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Cart.findOneAndDelete({ _id: id, user: req.user.id })
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});
module.exports = router;
