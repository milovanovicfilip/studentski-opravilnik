import express from "express";
import ProjectController from "../Controllers/Project.Controller.mjs";
import { authenticateUser } from "../utils/authenticateUser.js";

const router = express.Router();
const projectController = new ProjectController();

router.post("/", authenticateUser, projectController.createProject);
router.get("/", authenticateUser, projectController.getAllProjects);
router.get("/:id", authenticateUser, projectController.getProjectById);
router.put("/:id", authenticateUser, projectController.updateProject);
router.delete("/:id", authenticateUser, projectController.deleteProject);

router.post("/add-task", projectController.addTaskToProject); // Add task to project

export default router;
