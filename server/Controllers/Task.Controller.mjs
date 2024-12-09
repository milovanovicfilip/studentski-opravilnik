import { Task } from "../Models/Task.Model.mjs";

export default class TaskController {
  constructor() {}

  createTask = async (request, response) => {
    try {
      const { title, content, status, priority, dueDate, tags } = request.body;
      const newTask = await Task.create({
        title,
        content,
        status,
        priority,
        dueDate,
        tags,
      });
      response.status(201).json(newTask);
    } catch (error) {
      response.status(400).json({
        message: "Failed to create task",
        error: error.message,
      });
    }
  };

  getAllTasks = async (request, response) => {
    try {
      const tasks = await Task.find();
      response.status(200).json(tasks);
    } catch (error) {
      response.status(500).json({
        message: "Failed to fetch tasks",
        error: error.message,
      });
    }
  };

  getTaskById = async (request, response) => {
    try {
      const { id } = request.params;
      const task = await Task.findById(id);

      if (!task) {
        return response.status(404).json({ message: "Task not found" });
      }

      response.status(200).json(task);
    } catch (error) {
      response.status(400).json({
        message: "Failed to retrieve task",
        error: error.message,
      });
    }
  };

  updateTask = async (request, response) => {
    try {
      const { id } = request.params;
      const updateData = request.body;

      const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedTask) {
        return response.status(404).json({ message: "Task not found" });
      }

      response.status(200).json(updatedTask);
    } catch (error) {
      response.status(400).json({
        message: "Failed to update task",
        error: error.message,
      });
    }
  };

  deleteTask = async (request, response) => {
    try {
      const { id } = request.params;

      const deletedTask = await Task.findByIdAndDelete(id);

      if (!deletedTask) {
        return response.status(404).json({ message: "Task not found" });
      }

      response.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      response.status(400).json({
        message: "Failed to delete task",
        error: error.message,
      });
    }
  };

  searchTasks = async (request, response) => {
    try{
      const { title } = request.params;

      const tasks = await Task.find({ title: new RegExp(title, 'i') });

      response.status(200).json(tasks);
    }catch(error){
      response.status(400).json({
        message: "Failed to search tasks",
        error: error.message
      })
    }
  }
}
