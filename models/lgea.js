const mongoose = require('mongoose');

const localGovSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('localGovernment', localGovSchema);