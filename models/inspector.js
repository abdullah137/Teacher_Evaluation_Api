const mongoose = require('mongoose');
const inspectorSchema = new mongoose.Schema({
    firstName: {
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
    lgeaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lgea',
        required: true
    },
    schools: [
        {
            id: {
                type: Array,
                ref: 'School'
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