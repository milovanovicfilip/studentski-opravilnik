import express from "express";
import TaskController from "../Controllers/Task.Controller.mjs";
import { authoriseUser } from "../utils/authoriseUser.js";

const router = express.Router();
const taskController = new TaskController();

router.use(authoriseUser);

router.get("/", taskController.getAllTasks);

router.post("/", taskController.createTask);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

router.get("/export/csv", taskController.exportToCSV);
router.post("/import/csv", taskController.importFromCSV);
router.get("/search/:title", taskController.searchTasks);

export default router;
