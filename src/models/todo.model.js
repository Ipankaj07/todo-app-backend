const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: Array, required: true },
    subTasks: [
        {
            title: { type: String, required: true },
            isCompleted: { type: Boolean, default: false, required: false },
        }
    ],
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    versionKey: false
})

module.exports = mongoose.model('Todo', todoSchema);