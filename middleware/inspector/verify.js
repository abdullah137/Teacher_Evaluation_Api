const jwt = require('jsonwebtoken');
const Inspector = require('../../models/inspector');

async function auth(req, res, next) {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header and splitting to get token
            token = req.headers.authorization.split(' ')[1];
           
            // verify token
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
           
            // get user from the token
            req.inspector = await Inspector.findById(decoded.id).select('-password').populate('lgeaId');
  
            // check if the id exist
            if(req.inspector === null){
                res.status(401).json({
                    error: "INVALID_TOKEN",
                    status: false,
                    message: "Sorry, You entered an invalid token" 
                });
                return; 
            } 

            next()
        }catch(error) {
            console.log(error.messege)
            res.status(401).json({
                error: "NOT_AUTHORIZED",
                status: false,
                message: "Sorry, You are not authorized" 
            });
            return;
        }
    }

    if(!token) {
        res.status(401).json({
            error: "TOKEN_REQUIRED",
            status: false,
            message: "Sorry, Kindly Input Your Token"
        });
        return;
    }
}

module.exports = { auth }