import express from "express";
import { getNotifications, markNotificationAsRead } from "../Controllers/Notification.Controller.mjs";

const router = express.Router();

router.get("/", getNotifications);
router.put("/read", markNotificationAsRead);
export default router;
