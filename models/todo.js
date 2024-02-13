import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    uppercase: true,
    maxLength: 50,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required:true
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  }
});

const Task = mongoose.model("Tasks",todoSchema);

export default Task;
