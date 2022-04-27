const express = require('express');
const passport = require('passport');
const router = express.Router();

// importing the controllers in to the route
const { _home, login, signup, googleOauthController, logout } = require('../../../controllers/admin/oauth/index')

router.get('/', _home);

router.post('/signup', login)

router.get('/google/signup', passport.authenticate('google', {
     scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google',
 { failureRedirect: '/auth/google/failure' }),
   googleOauthController);

router.post('/signin', signup);

router.get('/logout', logout);

module.exports = router;