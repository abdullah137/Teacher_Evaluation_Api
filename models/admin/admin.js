const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true,
        required: true,
    },
    profileImg: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    otpCode: {
        type: Number
    },
    otpDate: {
        type: Date,
        default: Date.now
    },
    isVerfied: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Admin', adminSchema);