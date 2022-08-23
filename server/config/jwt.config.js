const jwt = require("jsonwebtoken")
module.exports.authenticateUser = (req, res, next) =>{
    jwt.verify(req.cookies.userToken, process.env.SECRET_KEY, (err, payload) =>{
        err? res.status(401).json({authenticatedUser:false}) : next()
    });
}