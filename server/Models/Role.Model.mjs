import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ["admin", "manager", "user"]
    },
    permissions: [{
        type: String,
        required: true,
        enum: ["create_task","delete_task","assign_task","add_user","remove_user","delete_project","rename_project"],
    }]
});

export const Role = mongoose.model("Role", roleSchema);
