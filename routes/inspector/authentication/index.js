const express = require('express');
const router = express.Router();

// Importing our controllers here
const { login, resetPassword } = require('../../../controllers/inspector/authentication/index'); 

router.post('/signin', login);

router.post('/reset-password', resetPassword)

module.exports = router;