import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title: String,
    content: String,
}, {timestamps: true})

export const Task = mongoose.model('Task',taskSchema);