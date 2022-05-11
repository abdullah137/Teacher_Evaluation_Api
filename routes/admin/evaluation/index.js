const express = require('express');
const router = express.Router();

const {  _getAll,_insert, _getSpecific, _getEvaluation, _update, _delete } = require('../../../controllers/admin/evaluation/index');

router.get('/', _getAll);

router.post('/', _insert)

router.get('/:id', _getSpecific);

router.get('/:eval/:id', _getEvaluation);

router.put('/:id', _update);

router.delete('/:id', _delete);

module.exports = router;