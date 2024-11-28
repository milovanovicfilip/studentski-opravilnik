import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {type: String, unique:true},
    password: String,
    email: {type: String, unique:true},
    avatarUrl: String,
    salt: String,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
});

export const User = mongoose.model('User',userSchema)