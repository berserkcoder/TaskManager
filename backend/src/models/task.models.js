import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index:true
    }
    // ,priority: {
    //     type: String,
    //     enum: ["low", "medium", "high"],
    //     default: "medium"
    // }

},{timestamps:true});

export const Task = mongoose.model("Task",taskSchema);