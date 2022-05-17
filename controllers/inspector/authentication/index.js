const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// importing the validation needed
const { loginValidation, profileValidation } = require('../../../utils/inspector/validation');

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
    req.inspector = null;
    res.status(200).json({
        status: true,
        message: "LOGOUT_SUCCESSFULLY",
        data: {}
    });
    return;
}

const resetPassword = async(req, res) => {
    
    // getting insepctor email
    const { email } = req.body;

    // checking if email is empty
    if(!email) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message,
        })
        return; 
    }

    try {

        // check if email exists
        const checkInspector = await Inspector.findOne({ email: email.toLowerCase() });
       
        if(!checkInspector) {
            res.status(404).json({
                error: "NONE_ACCOUNT_EXIST",
                status: false,
                message: "Sorry, inspector do not exist"
            });
            return;
        }
        const inspectorId  = checkInspector.id


        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(email, salt);

        // updating inspector recors
        const updateRecord = await Inspector.findByIdAndUpdate({
            _id: inspectorId
            }, {
                 $set: {
                    password: hashPassword
                 }
             });
          
        // updating inspctor records
        if(updateRecord) {
            res.status(200).json({
                message: "PASSWORD_RESET_SUCCESSFULLY",
                status: true,
                query: updateRecord
            });
            return;
        }    

    }catch(error) {
        console.log(error.message)
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: "Sorry, an internal error occurs"
        })
    }

}

const updateProfile = async(req, res) => {
   
    // getting req body
    let { email, lastName, firstName, password } = req.body
    
    // joi validation
    const { error } = profileValidation(req.body);

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return;
    }

    try {
        
        // check to see if email is already registered
    const checkEmail = await Inspector.findOne({ email: email });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Update records
    const updateInspectorPassword = await Inspector.findByIdAndUpdate({ _id: checkEmail.id }, {
        $set: {
            firstName: firstName,
            password: hashPassword,
            lastName: lastName
        }
    }, { new: true });

    if(updateInspectorPassword) {
        
        res.status(200).send({
            message: "UPDATED_SUCCESSFULLY",
            status: true,
            query: updateInspectorPassword
        })
        return;
    }

    }catch(error) {
        console.log(error)
        
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return;
    }
    
    
}

module.exports = { logout, login, updateProfile, resetPassword }