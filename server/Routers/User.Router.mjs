import express from "express";
import UserController from "../Controllers/User.Controller.mjs";
import { authenticateUser } from "../utils/authenticateUser.js";

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.addUser);
router.post("/login", userController.loginUser);
router.get("/current", userController.getCurrentUser);
router.post("/logout", userController.logoutUser);

// Protected routes
router.get("/getTasks/:id", authenticateUser, userController.getUserPosts);
router.delete("/:id", authenticateUser, userController.removeUser);
router.put("/:id", authenticateUser, userController.updateProfile);

export default router;
