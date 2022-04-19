const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
    staffId: {
        type: String,
        require: true
    },
    firstName: {
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
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    profileImg: {
        type: String,
        default: 'avatar.png'
    }, 
    password: {
        type: String
    },
    lgeas: {
        type: Array
    },
    priveledges: {
        type: Array
    }
});

module.exports = mongoose.model('staff', staffSchema);