import express, {Router} from 'express';
import UserController from '../Controllers/User.Controller.mjs';
import { authoriseUser } from '../utils/jwt.js';

const router = express.Router();
const userController = new UserController();

router.post('/register',userController.addUser);
router.post('/login',userController.loginUser);

router.get('/logout',authoriseUser,userController.logoutUser);
router.get('/getTasks/:id',authoriseUser,userController.getUserPosts);
router.get('/:id', userController.getUserData);

router.delete('/:id',authoriseUser,userController.removeUser);

router.put('/:id',authoriseUser,userController.updateProfile);

export default router;