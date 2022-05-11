const express = require('express');
const router = express.Router();

// importing the controller needed
const { _getAll, _getSpecific, _insert, _update, _delete } = require('../../../controllers/admin/teacher/index');

// Importing the authentication needed
const { auth } = require('../../../middleware/jwtAuth');

router.get('/', auth, _getAll);

router.get('/:id', auth, _getSpecific);

router.post('/', auth, _insert);

router.put('/:id', auth, _update);

router.delete('/:id', auth, _delete);

module.exports = router;