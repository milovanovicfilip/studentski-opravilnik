import express from "express";
import ProjectController from "../Controllers/Project.Controller.mjs";
import { authoriseUser } from "../utils/authoriseUser.js";

const router = express.Router();
const projectController = new ProjectController();

router.post("/", authoriseUser, projectController.createProject);
router.get("/", authoriseUser, projectController.getAllProjects);
router.get("/:id", authoriseUser, projectController.getProjectById);
router.put("/:id", authoriseUser, projectController.updateProject);
router.delete("/:id", authoriseUser, projectController.deleteProject);

router.post("/add-task", projectController.addTaskToProject); // Add task to project

export default router;
