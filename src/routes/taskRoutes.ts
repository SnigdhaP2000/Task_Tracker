import express, { Request, Response } from 'express';
import { tenantMiddleware } from "../middlewares/tenantMiddleware";
import TaskController from "../controllers/taskController";

const router = express.Router();
const taskController = new TaskController();

router.get('/healthcheck', tenantMiddleware, taskController.healthCheck);

// Example route to get all tasks
router.get('/tasks', tenantMiddleware, taskController.tasks);

// Example route to create a new task
router.post('/tasks', tenantMiddleware, taskController.tasks);

// Example route to update a task
router.patch('/tasks', tenantMiddleware, taskController.tasks);

// Example route to delete a task
router.delete('/tasks', tenantMiddleware, taskController.tasks);
export default router;