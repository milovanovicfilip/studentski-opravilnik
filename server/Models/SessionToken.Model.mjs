import mongoose from "mongoose";

const sessionTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 14400 // 4 x 3600 sekund
    },
});

export const SessionToken = mongoose.model("SessionToken", sessionTokenSchema);
