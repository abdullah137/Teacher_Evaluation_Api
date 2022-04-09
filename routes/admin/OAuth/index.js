const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// importing the validation needed
const { registerValidation, loginValidation, lgeaValidation } = require('../../../utils/admin/validation');

// Importing the models here
const Admin = require('../../../models/admin');
const Lgea = require('../../../models/lgea');

router.get('/', (req, res) => {
    
    res.status(404).json({
        error: "UNKNOWN_ROUTES",
        status: false,
        message: "Oops 😓, You are acessing the wrong routes"
    })
});


router.post('/signup', async(req, res) => {

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
})

router.get('/google/signup', passport.authenticate('google', {
     scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google',
 { failureRedirect: '/auth/google/failure' }),
  (req, res) => {
   
    // Inserted Sucessfully
    res.status(200).json({
        message: "Account Created Successfully",
        status: true,
        admin: req.admin
    })
    return;
});

router.post('/signin', async (req, res) => {

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
    const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);

    res.status(200).json({
        status: true,
        message: "Logged In",
        token
    })
    return;
});

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({
        status: true,
        message: "Admin logged Out Successfully"
    });
});

router.post('/add-lgea', async(req, res) => {

    // get all the request body

    let { name, color, image } = req.body;
    // use joi to check

    const { error } = lgeaValidation(req.body)

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message,
        })
        return;
    }


    // use json to validate to ensure the user is loged in
    
    // check if the name alredy exist
    let lgeaName = name.toLowerCase();
    const lgeaExist =  await Lgea.findOne({name: lgeaName});


    if(lgeaExist) {
        res.status(400).json({
            error: "LGEA_EXIST",
            status: false,
            message: "Oops, local governemnt already exist"
        })
        return;
    }
    // then insert the body
    const lgea = Lgea({
        name: lgeaName,
        color: color,
        image: image
    });

    try {
        const insertLgea = await lgea.save();
        res.status(200).send({
            message: "INSERTED_SUCCESSFULLY",
            status: true,
            query: insertLgea
        })
        return;
    }catch(error) {
        res.send(500).json({
            error: "INTERNAL_ERROR",
            status: true,
            message: error
        })
        return;
    }
});

module.exports = router;