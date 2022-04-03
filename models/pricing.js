const mongoose = require('mongoose');
const priceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    features: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Price', priceSchema);