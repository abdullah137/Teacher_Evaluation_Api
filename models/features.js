const mongoose = require('mongoose');
const featuresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Feauture', featuresSchema);