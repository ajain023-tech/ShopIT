const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config()

// checks the login token and puts the user id in req.user.id
// 401 = not logged in, or the token is invalid / expired
const fetchUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send("Access denied")
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send("Access denied")
    }
}

module.exports = fetchUser
