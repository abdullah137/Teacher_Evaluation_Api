const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
    staffId: {
        type: String,
        require: true
    },
    fistName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: 'avatar.png'
    }, 
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('staff', staffSchema);