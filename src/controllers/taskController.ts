import express from "express";
import TaskService from "../services/taskServices";
const taskService = new TaskService(); // create instance OUTSIDE the class

export default class TaskController {

    private taskService: TaskService;

    constructor() {
        this.taskService = taskService;  // assign to class-level property
    }

    public healthCheck = async (req: express.Request, res: express.Response) => {
        try {
            const result =await this.taskService.healthCheck(req);
            res.status(200).json({status:"success", message: "checking helath. OK.", data:{} });
        } catch (error) {
            console.error("Error in healthCheck:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    public tasks = async (req: express.Request, res: express.Response) => {
        try {
            const result =await this.taskService.tasks(req);
            res.status(200).json({status:"success", message:result.message, data:result.data });
        } catch (error) {
            console.error("Error in tasks:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    public taskComments = async (req: express.Request, res: express.Response) => {
        try {
            const result =await this.taskService.taskComments(req);
            res.status(200).json({status:"success", message:result.message, data:result.data });
        } catch (error) {
            console.error("Error in task comments:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    public taskFilters = async (req: express.Request, res: express.Response) => {
        try {
            const result =await this.taskService.taskFilters(req);
            res.status(200).json({status:"success", message:result.message, data:result.data });
        } catch (error) {
            console.error("Error in task filters:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}