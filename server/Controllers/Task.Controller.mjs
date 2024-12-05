import { Task } from "../Models/Task.Model.mjs";
import multer from "multer"
import fs from "fs"
import { Parser } from "json2csv"
import csvParser from "csv-parser";

const upload = multer({ dest: "uploads/" });
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

  exportToCSV = async (request, response) => {
    try{
      const tasks = await Task.find({userId: request.user.id})

      const formattedTasks = tasks.map(task => ({
        _id: task._id,
        title: task.title,
        content: task.content,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        tags: task.tags.join(';'),
        user: task.user
      }));

      const fields = ["_id","title","content","status","priority","dueDate","createdAt","tags","user"]
      const parser = new Parser({ fields })
      const csv = parser.parse(formattedTasks);

      response.header('Content-Type','text/csv');
      response.attachment(`tasks_${Date.now()}_${request.user.id}`)
      response.send(csv);
    }catch(error){
      response.status(500).json({
        message: "Error with exporting to CSV",
        error: error.message
      })
    }
  };
  
  importFromCSV = async (request, response) => {
    try{
      //.si
    }catch(error){
      response.status(500).json({
        message: "Error with importing from CSV",
        error: error.message
      })
    }
  };
}
