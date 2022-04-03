const mongoose = require('mongoose');
const resetPasswordSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otpCode: {
        type: Number,
        required: true
    },
    urlId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('resetPassword', resetPasswordSchema);