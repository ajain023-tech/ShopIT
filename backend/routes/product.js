const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product')

// to fetch all products
router.get('/fetchproduct', async (req, res) => {
    try {

        const product = await Product.find()
        res.send(product)
    }
    catch (error) {

        res.status(500).send("Something went wrong")
    }
})
// To get Single product
router.get('/fetchproduct/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid product id' })
        }
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' })
        }
        res.send(product)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})
// to get products for single category
router.post('/fetchproduct/type', async (req, res) => {
    const { userType } = req.body
    if (!userType) {
        return res.status(400).json({ msg: 'Product type (userType) is required' })
    }
    try {
        const product = await Product.find({ type: userType })
        res.send(product)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})
// to get products category wise
router.post('/fetchproduct/category', async (req, res) => {
    const { userType, userCategory } = req.body
    if (!userType) {
        return res.status(400).json({ msg: 'Product type (userType) is required' })
    }
    try {
        if (userCategory == "all") {
            const product = await Product.find({ type: userType })
            res.send(product)
        }
        else if (userCategory == "pricelowtohigh") {
            const product = await Product.find({ type: userType }).sort({ price: 1 })
            res.send(product)
        }
        else if (userCategory == "pricehightolow") {
            const product = await Product.find({ type: userType }).sort({ price: -1 })
            res.send(product)
        }
        else if (userCategory == "highrated") {
            const product = await Product.find({ type: userType }).sort({ rating: -1 })
            res.send(product)
        }
        else if (userCategory == "lowrated") {
            const product = await Product.find({ type: userType }).sort({ rating: 1 })
            res.send(product)
        }
        else {
            const product = await Product.find({ type: userType, category: userCategory })
            res.send(product)
        }
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})

module.exports = router