import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, "Neveljaven e-poštni naslov."],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    avatarUrl: {
        type: String,
        match: [/^https?:\/\/.+\..+/, "Neveljaven URL format."],
    },
    emailNotifications: {
        type: Boolean,
        default: false
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    projects: [{
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    }]
});

export const User = mongoose.model("User", userSchema);
