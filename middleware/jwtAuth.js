const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('beep-auth-token');
    if(!token) {
        res.status(401).json({
            error: "TOKEN_REQUIRED",
            status: false,
            message: "Sorry, Kindly Input Your Token"
        });
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.admin = verified;
    }   catch(error) {
         res.status(400).json({
            error: "INVALID_TOKEN",
            status: true,
            message: "Na wa for you oo" 
        });
        return;
    }
}

module.exports = { auth }