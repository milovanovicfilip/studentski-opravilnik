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
        match: [/^https?:\/\/.+\..+/, "Invalid URL format."],
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
});

const User = mongoose.model("User", userSchema);

export default User;
