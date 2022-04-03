const mongoose = require('mongoose');
const accessCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    accessLevel: {
        type: String,
        enum: [ 'Super-Admin', 'Educational-Expert', 'Funder', 'Researcher', 'Government-MDA' ],
        default: 'Researcher',
        required: true
    }, 
    interlude: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        enum: [ 0, 1, 2 ],
        default: 0,
    },
    appointStatus: {
        type: Boolean,
        default: false
    }, 
    appointId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor',
        requied: true
    }
});

module.exports = mongoose.model('accessCode', accessCodeSchema);