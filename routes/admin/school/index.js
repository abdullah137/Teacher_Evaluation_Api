const express = require('express');
const router = express.Router();

// Importing the controllers as usaul
const { _getAll, _getSpecific, _insert, _update, _delete } = require('../../../controllers/admin/school/index')

// Importing verfication
const { auth } = require('../../../middleware/jwtAuth');

router.get('/', _getAll);

router.get('/:id', auth, _getSpecific);

router.post('/', auth, _insert);

router.put('/:id', _update);

router.delete('/:id', auth, _delete);

module.exports = router;