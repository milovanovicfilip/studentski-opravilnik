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
    role: {
        type: String,
        enum: ["admin","manager","user"],
        default: "user"
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks"
    }]
});

export const User = mongoose.model("User", userSchema);
