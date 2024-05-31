import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteTask, getTasks, newTask, singleTask, updateTask } from "../controllers/task.js";

const router = express.Router();

router.post("/new", isAuthenticated, newTask);
router.get("/myTasks", isAuthenticated, getTasks);
router.route("/:id").put(isAuthenticated,updateTask).delete(isAuthenticated, deleteTask).get(isAuthenticated, singleTask);

export default router