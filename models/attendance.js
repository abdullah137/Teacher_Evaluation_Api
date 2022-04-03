const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    adminId: {
        type: Number
    },
    lgeaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lgea',
        required: true
    },
    teacherId: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    otherName: {
        type: String
    },
    module: {
        type: Number,
        required: true
    },
    attendanceCount: {
        type: Number,
        required: true,
    },
    attandanceTime: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model('attendance', attendanceSchema);