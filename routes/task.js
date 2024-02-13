import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteTask, getTasks, newTask, updateTask } from "../controllers/task.js";

const router = express.Router();

router.post("/new", isAuthenticated, newTask);
router.get("/myTasks", isAuthenticated, getTasks);
router.route("/:id").put(isAuthenticated,updateTask).delete(isAuthenticated, deleteTask);

export default router