const express = require('express');
const router = express.Router();

const {  _getAll, _getSpecific, _insert, _update, _delete } = require('../../../controllers/admin/staff/index');

router.get('/', _getAll);

router.get('/:id', _getSpecific);

router.post('/', _insert);

router.put('/:id', _update);

router.delete('/:id', _delete);

module.exports = router;