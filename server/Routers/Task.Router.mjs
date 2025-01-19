import express from "express";
import TaskController from "../Controllers/Task.Controller.mjs";
import { Project } from "../Models/Project.Model.mjs";
import { authoriseUser } from "../utils/authoriseUser.js";

const router = express.Router();
const taskController = new TaskController();

// Apply authorization middleware to all task routes
router.use(authoriseUser);

// Route to get all tasks, possibly filtered by project
router.get("/", taskController.getAllTasks);

// Routes for CRUD operations
router.post("/", taskController.createTask); // Create
router.get("/:id", taskController.getTaskById); // Read by ID
router.put("/:id", taskController.updateTask); // Update
router.delete("/:id", taskController.deleteTask); // Delete

// Additional routes for CSV operations and search
router.get("/export/csv", taskController.exportToCSV);
router.post("/import/csv", taskController.importFromCSV);
router.get("/search/:title", taskController.searchTasks);

export default router;
