const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required and should be unique'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    mobileNumber: {
        type: String, 
    },
    address: {
        type: String,
    },
    occupation: {
        type: String,
    },
}, { timestamps: true });

// Create the user model
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
