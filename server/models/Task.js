import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Subtask title is required"]
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Comment text is required"]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"]
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subtasks: [SubtaskSchema],
    comments: [CommentSchema]
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
