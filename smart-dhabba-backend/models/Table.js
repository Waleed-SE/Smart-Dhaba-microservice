const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    isReserved: {
        type: Boolean,
        default: false
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reservationTime: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
