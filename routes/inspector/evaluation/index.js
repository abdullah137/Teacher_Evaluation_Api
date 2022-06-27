const express = require('express');
const router = express.Router();

// Importing authentication for private route
const { auth } = require('../../../middleware/inspector/verify');

// Importing the controllers needed
const { getAllEvaluation, getSpecificEvaluation, insertEvaluation, deleteEvaluation,
updateEvaluation } = require('../../../controllers/inspector/evaluation/index')

router.get('/',  auth, getAllEvaluation);

router.get('/:id', auth, getSpecificEvaluation);

router.post('/', auth, insertEvaluation);

router.delete('/:id', auth, deleteEvaluation);

router.put('/:id', auth, updateEvaluation);

module.exports = router;