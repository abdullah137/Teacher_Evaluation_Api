const mongoose = require('mongoose');
const inspectorSchema = new mongoose.Schema({
    fistName: {
        type: STring,
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
        required: true
    },
    schools: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'School',
                required: true
            },
            name: {
                type: String,
                required: true,
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