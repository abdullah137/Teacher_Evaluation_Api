const express = require('express');
const router = express.Router();

// Importing the controllers
const {  _getAll, _getSpecific, _insert, _update, _delete } = require('../../../controllers/admin/inspector/index');

// Importing Token verfication
const { auth } = require('../../../middleware/jwtAuth');

router.get('/', auth, _getAll);

router.get('/:id', auth, _getSpecific)

router.post('/', auth, _insert);

router.put('/:id', auth, _update);

router.delete('/:id', auth, _delete);

module.exports = router;