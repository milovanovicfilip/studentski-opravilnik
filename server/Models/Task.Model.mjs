import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title: String,
    content: String,
    createdAt: Number,
    tags: [String],
})

export const Task = mongoose.model('Task',taskSchema);