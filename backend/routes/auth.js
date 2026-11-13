const express = require('express');
const jwt = require("jsonwebtoken");
// logins stay valid for 7 days, after that the user has to login again
const TOKEN_EXPIRES_IN = '7d';
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const authUser = require('../middleware/authUser');
const dotenv = require('dotenv');
const { deleteAllUserData } = require('../controller/deleteUser');
dotenv.config()


// create a user :post "/auth",!auth
let success = false
router.post('/register', [

    body('firstName', 'Enter a valid name').isLength({ min: 1 }),
    body('lastName', 'Enter a valid name').isLength({ min: 1 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('phoneNumber', 'Enter a valid phone number').isLength({ min: 10, max: 10 })


], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
        return res.status(400).json({ error: errors.array() })
    }
    const { firstName, lastName, email, phoneNumber, password } = req.body

    try {
        let user = await User.findOne({ $or: [{ email: email }, { phoneNumber: phoneNumber }] });
        if (user) {
            return res.status(400).send({ error: "Sorry a user already exists" })
        }

        // password hashing
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(password, salt)

        // create a new user
        user = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        success = true
        const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })
        res.send({ success, authToken })
    }
    catch (error) {
        res.status(500).send("Internal server error")
    }
})


// login Route
router.post('/login', [

    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    const { email, password, } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {

            return res.status(400).send({ success, error: "User not found" })
        }
        const passComp = await bcrypt.compare(password, user.password)
        if (!passComp) {
            return res.status(400).send({ success, error: "Please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user._id
            }
        }

        const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })
        success = true
        res.send({ success, authToken })
    }
    catch (error) {
        res.status(500).send("Internal server error002")
    }
}
);
// logged in user details

router.get('/getuser', authUser, async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password")
        success = true
        res.send(user)


    } catch (error) {
        res.status(400).send("Something went wrong")
    }
}
)


// update user details
router.put('/updateuser', authUser, async (req, res) => {
    const { userDetails } = req.body
    // only these fields can be changed from the profile page
    const allowedFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'zipCode', 'city', 'userState', 'budget']
    let convertData = {}
    try {
        const parsed = typeof userDetails === 'string' ? JSON.parse(userDetails) : userDetails
        allowedFields.forEach(field => {
            if (parsed && parsed[field] !== undefined) convertData[field] = parsed[field]
        })
    } catch (error) {
        return res.status(400).send("Invalid details")
    }
    if (convertData.budget !== undefined) {
        const budget = Number(convertData.budget)
        if (!Number.isFinite(budget) || budget < 0 || budget > 10000000) {
            return res.status(400).send("Please enter a valid budget")
        }
        convertData.budget = Math.round(budget)
    }
    try {
        const user = await User.findById(req.user.id)
        if (user) {
            let updateDetails = await User.findByIdAndUpdate(req.user.id, { $set: convertData })
            success = true
            res.status(200).send({ success })
        }
        else {
            return res.status(400).send("User Not Found")
        }
    } catch (error) {
        res.send("Something went wrong")
    }
})

// change password of the logged in user
router.post('/changepassword', authUser, async (req, res) => {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword || newPassword.length < 5) {
        return res.status(400).send("Please enter a valid password")
    }
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(400).send("User Not Found")
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).send("Please enter correct password")
        }
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()
        res.send("Password changed successfully")
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})

// delete the logged in user and all their data
router.delete('/delete/user', authUser, deleteAllUserData)
module.exports = router