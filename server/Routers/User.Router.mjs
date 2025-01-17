import express from "express";
import UserController from "../Controllers/User.Controller.mjs";
import { authoriseUser } from "../utils/authoriseUser.js";

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.addUser);
router.post("/login", userController.loginUser);
router.get("/current", userController.getCurrentUser);
router.post("/logout", userController.logoutUser);
router.post("/logout-all", authoriseUser, userController.logoutAllSessions);

// Protected routes
router.get("/getTasks/:id", authoriseUser, userController.getUserPosts);
router.delete("/", authoriseUser, userController.removeUser);

router.get("/profile", authoriseUser, async (req, res) => {
    try {
        const user = await userController.getUserById(req.session.user.id);
        res.render("users-profile", { user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
router.put("/profile", authoriseUser, userController.updateProfile);
router.get("/data", authoriseUser, userController.getUserData);

export default router;
