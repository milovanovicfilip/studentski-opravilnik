import { Notification } from "../Models/Notification.Model.mjs";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate("taskId");
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true; // ker obvestla še niso foločean za uporabnika, ampak nalogo
        await notification.save();

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
    }
};
