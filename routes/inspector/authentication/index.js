const express = require('express');
const router = express.Router();

// Importing our controllers here
const { login, logout, resetPassword } = require('../../../controllers/inspector/authentication/index'); 

// Importing the 

router.post('/signin', login);

router.get('/logout',  logout)

router.patch('/reset-password', resetPassword)

module.exports = router;