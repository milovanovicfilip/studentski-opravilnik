import express, {Router} from 'express';
import TaskController from '../Controllers/Task.Controller.mjs';

const router = express.Router();
const taskController = new TaskController();

router.get('/',taskController.getAllTasks);

export const taskRouter = router;
