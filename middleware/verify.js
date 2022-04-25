const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).json({
            error: "TOKEN_REQUIRED",
            status: false,
            message: "Sorry, Kindly Login to access this routes"
        });
        
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.admin = verified;
    }   catch(error) {
        return res.status(400).json({
            error: "INVALID_TOKEN",
            status: true,
            message: "Na wa for you oo" 
        })
    }
}

module.exports = { auth }