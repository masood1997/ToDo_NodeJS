import { ErrorHandler } from "../middlewares/error.js";
import Task from "../models/todo.js";

const newTask = async (req, res, next) => {
  const { title, description } = req.body;
  const newTask = await Task.create({
    title,
    description,
    user: req.user._id,
  });

  res.status(201).json({
    success: "true",
    message: "Task Created",
  });
};

const getTasks = async (req, res, next) => {
  const { _id } = req.user;
  // here we are passing only the fields we want in the get tasks query and have to explicitly mention to send the task id.
  const tasks = await Task.find({ user: _id }).select({
    title: 1,
    description: 1,
    isCompleted: 1,
    _id: 0,
  });
  res.status(200).json({
    success: "true",
    tasks,
  });
};

const updateTask = async (req, res, next) => {
  const _id = req.params.id;
  const task = await Task.findById(_id);
  if (!task) {
    return next(new ErrorHandler("Invalid Task Id", 404));
  }
  task.isCompleted = !task.isCompleted;
  await task.save();
  res.status(200).json({
    success: "true",
    message: "User is updated",
  });
};

const deleteTask = async (req, res, next) => {
  const _id = req.params.id;
  const task = await Task.findById(_id);
  if (!task) {
    return next(new ErrorHandler("Invalid Task Id", 404));
  }
  await task.deleteOne();
  res.status(200).json({
    success: "true",
    message: "Task Deleted",
  });
};
export { newTask, getTasks, updateTask, deleteTask };
