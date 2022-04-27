const express = require('express');
const router = express.Router();

const {  _getAll, _getSpecific, _getEvaluation, _update, _delete } = require('../../../controllers/admin/inspect/index');

router.get('/', _getAll);

router.get('/:id', _getSpecific);

router.get('/:eval/:id', _getEvaluation);

router.put('/:id', _update);

router.delete('/:id', _delete);

module.exports = router;