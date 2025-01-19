import express from "express";
import TaskController from "../Controllers/Task.Controller.mjs";
import { authoriseUser } from "../utils/authoriseUser.js";

const router = express.Router();
const taskController = new TaskController();

router.get("/search", taskController.searchTasks);
router.post("/", taskController.createTask); // Create
router.get("/", taskController.getAllTasks); // Read all
router.get("/:id", taskController.getTaskById); // Read by ID
router.put("/:id", taskController.updateTask); // Update
router.delete("/:id", taskController.deleteTask); // Delete
router.get("/export/csv",taskController.exportToCSV);
router.post("/import/csv",taskController.importFromCSV);

export default router;
