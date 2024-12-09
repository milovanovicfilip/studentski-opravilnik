import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: false
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", required:
            false
    },
    recipients: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: false // ko bomo lahko dodajali tasks uporabnikom moramo to spremeniti na true
            },
            isRead: {
                type: Boolean,
                default: false
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const Notification = mongoose.model("Notification", notificationSchema);
