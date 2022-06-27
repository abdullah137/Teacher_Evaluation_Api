const express = require('express');
const router = express.Router();

// Importing authentication for private route
const { auth } = require('../../../middleware/inspector/verify');

// Importing contorllers
const { getAllTeachers, getDetailTeacher } = require('../../../controllers/inspector/teacher/index');

router.get('/', auth, getAllTeachers);

router.get('/details/:id', auth, getDetailTeacher);

module.exports = router;