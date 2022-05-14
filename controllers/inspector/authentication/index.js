const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// importing the validation needed
const { loginValidation } = require('../../../utils/inspector/validation');

// Importing the models here
const Inspector = require('../../../models/inspector');

const login =  async(req, res) => {
    
    const { error } = loginValidation(req.body);

    if(error) {
        res.status(400).json({

            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message

        });
        return;
    }

     // Checking if the user exists
     const inspector = await Inspector.findOne({ email: req.body.email });

     if(!inspector) {
         res.status(400).json({
             error: "NONE_ACCOUNT_EXIST",
             status: false,
             message: "Sorry, this account already exist"
         });
         return;
     }


      // Check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, inspector.password);
    if(!validPass) {
        res.status(400).json({
            error: "INVALID_DETAILS",
            status: false,
            message: "Invalid Password Or Email"
        });
        return;
    }

     // creating and assigning token
     jwt.sign({ id: inspector._id }, process.env.TOKEN_SECRET,  { expiresIn: '2h' }, (err, token) => {
        
        res.status(200).json({
            status: true,
            message: "Logged In",
            token
        })
        return;
        
    });
    
}

const logout = async(req, res) => {

}

const resetPassword = async(req, res) => {
    
    // getting insepctor email
    const { email } = req.body;
    
    console.log(req.body);
}

module.exports = { logout, login, resetPassword }