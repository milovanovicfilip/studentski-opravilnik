import express from 'express';
import NotificationController from '../Controllers/Notification.Controller.mjs';
import { authoriseUser } from "../utils/authoriseUser.js";

const router = express.Router();

router.get('/', authoriseUser, NotificationController.getNotifications);

router.put('/:notificationId/read', authoriseUser, NotificationController.markNotificationAsRead);

router.put('/read-all', authoriseUser, NotificationController.markAllNotificationsAsRead);

export default router;
