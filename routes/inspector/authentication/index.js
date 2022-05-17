const express = require('express');
const router = express.Router();

// Importing our controllers here
const { login, logout, updateProfile, resetPassword } = require('../../../controllers/inspector/authentication/index'); 

// Importing authentication for private route
const { auth } = require('../../../middleware/inspector/verify');

router.post('/signin', login);

router.get('/logout',  logout)

router.patch('/reset-password', resetPassword)

router.put('/update-profile', auth, updateProfile)

module.exports = router;