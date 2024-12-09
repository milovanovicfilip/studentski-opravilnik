import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  dueDate: {
    type: Date,
  },
  warning: {
    type: Boolean, default: false
  },
  overdue: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  dependencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

export const Task = mongoose.model("Task", taskSchema);
