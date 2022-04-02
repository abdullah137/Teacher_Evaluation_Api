const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    console.log("Kindly Go Back to the routes page");
    res.sendStatus(404).json({
        error: "UNKNOWN_ROUTES",
        status: false,
        message: "Oops 😓, You are acessing the wrong routes"
    })
});

router.get('/google/signup', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    console.log("It has reach here");
});

router.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200).json({
        status: true,
        message: "Admin logged Out Successfully"
    });
});

module.exports = router;