import express from "express";
import UserController from "../Controllers/User.Controller.mjs";
import { authoriseUser } from "../utils/jwt.js";

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.addUser);
router.post("/login", userController.loginUser);

// Protected routes
router.get("/getTasks/:id", authoriseUser, userController.getUserPosts);
router.delete("/:id", authoriseUser, userController.removeUser);
router.put("/:id", authoriseUser, userController.updateProfile);

export default router;
