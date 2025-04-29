import express, { Request, Response } from 'express';
import { tenantMiddleware } from "../middlewares/tenantMiddleware";
import TaskController from "../controllers/taskController";

const router = express.Router();
const taskController = new TaskController();

router.get('/healthcheck', tenantMiddleware, taskController.healthCheck);

// route to get all tasks
router.get('/tasks', tenantMiddleware, taskController.tasks);
router.get('/task/comments', tenantMiddleware, taskController.taskComments);
router.get('/task/filters', tenantMiddleware, taskController.taskFilters);

// route to create a new task
router.post('/tasks', tenantMiddleware, taskController.tasks);
router.post('/task/comments', tenantMiddleware, taskController.taskComments);

// route to update a task
router.patch('/tasks', tenantMiddleware, taskController.tasks);
router.patch('/task/comments', tenantMiddleware, taskController.taskComments);

// route to delete a task
router.delete('/tasks', tenantMiddleware, taskController.tasks);
router.delete('/task/comments', tenantMiddleware, taskController.taskComments);

export default router;