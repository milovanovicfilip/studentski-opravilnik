import { Task } from "../Models/Task.Model.mjs";

export default class TaskController {
  constructor() { }

  createTask = async (req, res) => {
    try {
      const { title, content, status, priority, dueDate, tags, dependencies } = req.body;

      const dependencyTasks = await Task.find({ _id: { $in: dependencies } });
      if (dependencyTasks.some(task => task.status !== "completed")) {
        return res.status(400).json({
          message: "All dependencies must be completed before creating a task dependent on them.",
        });
      }

      const newTask = new Task({
        title,
        content,
        status,
        priority,
        dueDate,
        tags,
        dependencies,
      });

      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(400).json({ message: "Failed to create task", error: error.message });
    }
  };


  getAllTasks = async (request, response) => {
    try {
      const tasks = await Task.find();

      const updatedTasks = tasks.map((task) => calculateTaskStatus(task));

      await Promise.all(updatedTasks.map(task => task.save()));

      response.status(200).json(updatedTasks);
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

  updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.status === "completed") {
        const task = await Task.findById(id).populate("dependencies");

        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }

        const incompleteDependencies = task.dependencies.filter(dep => dep.status !== "completed");
        if (incompleteDependencies.length > 0) {
          return res.status(400).json({
            message: "Cannot mark task as completed until all dependencies are completed.",
          });
        }
      }

      const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: "Failed to update task", error: error.message });
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

  getDependencies = async (req, res) => {
    try {
      const { id } = req.params;

      const task = await Task.findById(id).populate("dependencies", "title status");
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json(task.dependencies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dependencies", error: error.message });
    }
  };
}

function calculateTaskStatus(task) {
  const now = new Date();
  const dueDate = new Date(task.dueDate);

  task.warning = !task.overdue && dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) && dueDate >= now;
  task.overdue = dueDate < now && task.status !== "completed";

  return task;
}
