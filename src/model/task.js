const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        trim: true,
        required: true,
    },
    isCompleted:{
        type: Boolean,
        required: false,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps:true,
})

const Task = mongoose.model('Tasks', taskSchema);

module.exports = Task