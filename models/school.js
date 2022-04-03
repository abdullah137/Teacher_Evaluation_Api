const mongoose = require('mongoose');
const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lgea: {
        type: String,
        required: true
    },
    lgeaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lgea',
        required: true
    },
    insertedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    }
});

module.exports = mongoose.model('school', schoolSchema);