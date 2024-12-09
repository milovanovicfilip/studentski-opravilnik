import express from 'express';
import ProjectController from '../Controllers/Project.Controller.mjs';
import { authoriseUser } from '../utils/jwt.js';

const router = express.Router();
const projectController = new ProjectController();

router.post('/', authoriseUser, projectController.addProject);
router.get('/:id', authoriseUser, projectController.getProject);
router.get('/', authoriseUser, projectController.getProjects);
router.put('/:id', authoriseUser, projectController.updateProject);
router.delete('/:id', authoriseUser, projectController.deleteProject);

export default router;
