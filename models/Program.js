const { strikethrough } = require('colors')
const mongoose = require('mongoose')

const ProgramSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add a program name']
    },
    description: {
        type: String,
        required: [true, 'Please add a program description']
    },
    acceptingVolunteer: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    nonprofit: {
        type: mongoose.Schema.ObjectId,
        ref: 'Nonprofit',
        required: true
    }
})

module.exports = mongoose.model('Program', ProgramSchema);