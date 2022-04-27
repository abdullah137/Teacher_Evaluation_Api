const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// importing the validation needed
const { registerValidation, loginValidation } = require('../../../utils/admin/validation');

// Importing the models here
const Admin = require('../../../models/admin');

const _home =  (req, res) => {
    
    res.status(404).json({
        error: "UNKNOWN_ROUTES",
        status: false,
        message: "Oops 😓, You are acessing the wrong routes"
    })
}

const signup = async(req, res) => {

    // Getting our body respsonse 
    const {error} = registerValidation(req.body);

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return ;
    }

    // Check if the admin email already exist
    const emailExist = await Admin.findOne({ email: req.body.email })

    if(emailExist){
         res.status(400).json({ 
             error: "ACCOUNT_EXIST",
             status: false,
             message: 'Email aready exits'
          });
          return;
    } 

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create an admin
    const admin = Admin({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        isAdmin: true,
        profileImg: 'avatar',
        otpCode: Math.floor(Math.random()*90000) + 10000,
        password: hashPassword,
        isVerified: true
    });

    try {
        const saveAdmin = await admin.save();

        res.status(200).json({ 
            error: "INSERTED_SUCCESSFULLY",
            status: true,
            message: saveAdmin
        })
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error,
        })
    }
}

const googleOauthController = (req, res) => {
   
    // Inserted Sucessfully
    res.status(201).json({
        message: "Account Created Successfully",
        status: true,
        admin: req.admin
    })
    return;
}

const login = async (req, res) => {

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
    const admin = await Admin.findOne({ email: req.body.email });

    if(!admin) {
        res.status(400).json({
            error: "NONE_ACCOUNT_EXIST",
            status: false,
            message: "Sorry, this account already exist"
        });
        return;
    }

    // Check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if(!validPass) {
        res.status(400).json({
            error: "INVALID_DETAILS",
            status: false,
            message: "Invalid Password Or Email"
        });
        return;
    }

    // creating and assigning token
    const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).status(200).json({
        status: true,
        message: "Logged In",
        token
    })
    return;
}

const logout = (req, res) => {
    req.logout();
    res.status(200).json({
        status: true,
        message: "Admin logged Out Successfully"
    });
}

module.exports = { logout, login, signup, googleOauthController, _home }