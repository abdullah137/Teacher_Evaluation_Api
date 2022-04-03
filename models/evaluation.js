const mongoose = require('mongoose');
// import uuid for it
const evaluationSchema = new mongoose.Schema({
    // uuid will be the first
    inspectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inspector',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    eval_1: {
        type: String,
        required: true
    },
    m_1: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_2: {
        type: String,
        required: true
    },
    m_2: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_3: {
        type: String,
        required: true
    },
    m_3: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_4: {
        type: String,
        required: true
    },
    m_4: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_5: {
        type: String,
        required: true
    },
    m_5: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_6: {
        type: String,
        required: true
    },
    m_6: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_7: {
        type: String,
        required: true
    },
    m_7: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_7: {
        type: String,
        required: true
    },
    m_7: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_8: {
        type: String,
        required: true
    },
    m_8: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    eval_9: {
        type: String,
        required: true
    },
    m_9: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4 ]
    },
    totalStudent: {
        type: Number,
        required: true
    },
    evaluation: {
        type: Number,
        required: true,
        enum: [ 1, 2, 3, 4, 5, 6 ]
    },
    subject: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    rating: {
        type: String,
        required: true
    }, 
    comment: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [ 0, 1, 2 ],
        default: 0,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: String,
        ref: 'Staff'
    },
    approveDate: {
        type: Date
    }
});

module.exports = mongoose.model('evaluation', evaluationSchema)