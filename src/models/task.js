const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required:true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    }},{
        timestamps: true
    }
)

const Task = mongoose.model('Task', taskSchema)

// const User = mongoose.model('User', userSchema)

module.exports = Task