import { Notification } from '../models/Notification.Model.mjs';

class NotificationController {

    static async getNotifications(req, res) {
        try {
            const userId = req.session.user.id; // Get user ID from session
            if (!userId) return res.status(401).json({ message: "Unauthorized" });

            const notifications = await Notification.find({ user: userId }).sort({ timestamp: -1 });
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: "Error fetching notifications", error });
        }
    }

    static async markNotificationAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            const userId = req.session.user.id; // Get user ID from session

            const notification = await Notification.findOne({ _id: notificationId, user: userId });
            if (!notification) return res.status(404).json({ message: "Notification not found" });

            notification.read = true;
            await notification.save();
            res.status(200).json({ message: "Notification marked as read" });
        } catch (error) {
            res.status(500).json({ message: "Error updating notification", error });
        }
    }

    static async markAllNotificationsAsRead(req, res) {
        try {
            const userId = req.session.user.id; // Get user ID from session
            await Notification.updateMany({ user: userId }, { read: true });

            res.status(200).json({ message: "All notifications marked as read" });
        } catch (error) {
            res.status(500).json({ message: "Error updating notifications", error });
        }
    }

    static async createNotification(userId, title, description) {
        try {
            const newNotification = new Notification({ user: userId, title, description });
            await newNotification.save();
            console.log(`Notification saved: ${title}`);
        } catch (error) {
            console.error("Error saving notification:", error);
        }
    }
}

export default NotificationController;
