const mongoose = require('mongoose');
const inspectorSchema = new mongoose.Schema({
    fistName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    schools: [
        {
            id: {
                type: Array,
                ref: 'School',
                required: true
            },
            name: {
                type: Array,
            }
        }
    ],
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String
    }
});

module.exports = mongoose.model('Inspector', inspectorSchema);