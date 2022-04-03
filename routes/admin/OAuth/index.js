const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    
    res.status(404).json({
        error: "UNKNOWN_ROUTES",
        status: false,
        message: "Oops 😓, You are acessing the wrong routes"
    })
});


router.get('/google/signup', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google/failure' }), (req, res) => {
   
    console.log(req.admin);
    // Inserted Sucessfully
    res.status(200).json({
        message: "Account Created Successfully",
        status: true,
        admin: req.admin
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

module.exports = router;