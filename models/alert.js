const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        enum: ['above', 'below'],
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    alreadyInformed: {
        type: Boolean,
        default: false // Default is false (active alerts)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Alert', alertSchema);
