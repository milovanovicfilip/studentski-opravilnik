import express from "express";
import TaskController from "../Controllers/Task.Controller.mjs";

const router = express.Router();
const taskController = new TaskController();

router.post("/", taskController.createTask); // Create
router.get("/", taskController.getAllTasks); // Read all
router.get("/:id", taskController.getTaskById); // Read by ID
router.put("/:id", taskController.updateTask); // Update
router.delete("/:id", taskController.deleteTask); // Delete
router.get("/search/:title", taskController.searchTasks);

export default router;
