import { Notification } from '../models/Notification.Model.mjs';

export const createNotification = async (userId, title, description) => {
    try {
        const newNotification = new Notification({ user: userId, title, description });
        await newNotification.save();
        console.log(`Notification saved: ${title}`);
    } catch (error) {
        console.error("Error saving notification:", error);
    }
};
