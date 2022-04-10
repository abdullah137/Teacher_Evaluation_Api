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
    },
    otherInfo: [
        { 
            teachers: {
                type: Array
            },
            schools: {
                type: Array
            },
            inspectors: {
                type: Array
            }
        }
    ]
});

module.exports = mongoose.model('lgea', localGovSchema);