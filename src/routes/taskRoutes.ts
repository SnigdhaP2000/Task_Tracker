import express, { Request, Response } from 'express';
import { tenantMiddleware } from "../middlewares/tenantMiddleware";
import TaskController from "../controllers/taskController";

const router = express.Router();
const taskController = new TaskController();
const baseUrl = '/api/v1/task/';
router.get(`${baseUrl}healthcheck`, tenantMiddleware, taskController.healthCheck);

// route to get all tasks
router.get(`${baseUrl}tasks`, tenantMiddleware, taskController.tasks);
router.get(`${baseUrl}comments`, tenantMiddleware, taskController.taskComments);
router.get(`${baseUrl}filters`, tenantMiddleware, taskController.taskFilters);

// route to create a new task
router.post(`${baseUrl}tasks`, tenantMiddleware, taskController.tasks);
router.post(`${baseUrl}comments`, tenantMiddleware, taskController.taskComments);

// route to update a task
router.patch(`${baseUrl}tasks`, tenantMiddleware, taskController.tasks);
router.patch(`${baseUrl}comments`, tenantMiddleware, taskController.taskComments);

// route to delete a task
router.delete(`${baseUrl}tasks`, tenantMiddleware, taskController.tasks);
router.delete(`${baseUrl}comments`, tenantMiddleware, taskController.taskComments);

export default router;