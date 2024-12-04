import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tasks'
  }]
});

export const Project = mongoose.model("Project", projectSchema);