import { Task } from "../Models/Task.Model.mjs";
import multer from "multer"
import fs from "fs"
import { Parser } from "json2csv"
import csvParser from "csv-parser";

const upload = multer({ dest: "uploads/" });
export default class TaskController {
  constructor() { }

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

      const processedTask = calculateTaskStatus(newTask);
      await Task.findByIdAndUpdate(newTask._id, processedTask, { new: true });

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

      const processedTask = calculateTaskStatus(updatedTask);
      await Task.findByIdAndUpdate(id, processedTask, { new: true });

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
        title: task.title,
        content: task.content,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        tags: task.tags.join(';'),
      }));

      const fields = ["title","content","status","priority","dueDate","createdAt","tags"]
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
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        });
      }

      const tasks = [];
  
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (row) => {
          const task = {
            title: row.title,
            content: row.content,
            status: row.status,
            priority: row.priority,
            dueDate: row.dueDate,
            createdAt: row.createdAt,
            tags: row.tags.join(';'),
          };
          tasks.push(task); 
        })
        .on('end', async () => {
          try {
            const createdTasks = await Task.insertMany(tasks);
            
            return res.status(201).json({
              message: "Tasks created successfully",
              tasks: createdTasks,
            });
          } catch (error) {
            return res.status(500).json({
              message: "Error while inserting tasks into the database",
              error: error.message,
            });
          }
        })
        .on('error', (error) => {
          return res.status(400).json({
            message: "Error with importing from CSV",
            error: error.message,
          });
        });
    }catch(error){
      response.status(500).json({
        message: "Error with importing from CSV",
        error: error.message
      })
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

function calculateTaskStatus(task) {
  const now = new Date();
  const dueDate = new Date(task.dueDate);

  task.warning = !task.overdue && dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) && dueDate >= now;
  task.overdue = dueDate < now && task.status !== "completed";

  return task;
}