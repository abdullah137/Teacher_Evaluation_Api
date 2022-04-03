const mongoose = require('mongoose');
const attendanceCodeSchema = new mongoose.Schema({
    lgeaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Lgea'
    },
    accessCode: {
        type: String,
        required: true
    },
    lgea: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    codeStatus: {
        type: Number,
        enum: [ 0, 1, 2 ],
        default: 0
    },
    module: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    }
});

module.exports = mongoose.model('attendanceCode', attendanceCodeSchema);