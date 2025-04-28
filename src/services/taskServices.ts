import express,{ Request } from 'express';
import { CustomRequest } from "../middlewares/tenantMiddleware";

export default class TaskService {
    public healthCheck = async (req: CustomRequest)=> {
        const {tenantDb}=req;
        const result =await tenantDb.query("SELECT NOW()");
        return result;
    }

    public tasks =async(req: CustomRequest)=>{
        const {body, method, query, tenantDb}=req;
        const {assignee, 
            assigned_to, 
            status, 
            priority, 
            due_date, 
            title, 
            description,
            keyword,
            date_range}=body;
        const {id, type}=query;
        await tenantDb.query('BEGIN');
        let result;
        let message;
        try{
            switch (method) 
            {
                case 'GET':
                    let query = `SELECT * FROM tasks WHERE is_deleted=false`;
                    if(id) {
                        query += ` AND id=${id}`;
                    }
                    if(type) {
                        query += ` AND type='${type}'`;
                    }
                    if(assignee) {
                        query += ` AND assigned_by='${assignee}'`;
                    }
                    if(assigned_to) {
                        query += ` AND assigned_to='${assigned_to}'`;
                    }
                    if(status) {
                        query += ` AND status='${status}'`;
                    }
                    if(priority) {
                        query += ` AND priority='${priority}'`;
                    }
                    if(due_date) {
                        const{ start, end } = date_range;
                        query += ` AND due_date between '${start}' and '${end}'`;
                    }
                    if(keyword) {
                        query += ` AND title ILIKE '%${keyword}%'`;
                    }
                    result = await tenantDb.query(query);
                    console.log("result", result.rows);
                    message = "Tasks fetched successfully";
                    break;
                case 'POST':
                    result = await tenantDb.query(`
                        INSERT INTO tasks 
                        (assigned_by,
                        assigned_to,
                        status,
                        priority,
                        due_date,
                        title,
                        description) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7) 
                        RETURNING *`, 
                        [assignee, assigned_to, status, priority, due_date, title, description]);
                    message = "Task created successfully";
                    break;
                case 'PATCH':
                    result = await tenantDb.query(`
                        UPDATE tasks SET
                        assigned_by=$1,
                        assigned_to=$2,
                        status=$3,
                        priority=$4,
                        due_date=$5,
                        title=$6,
                        description=$7
                        WHERE id=$8
                        RETURNING *`,
                        [assignee, assigned_to, status, priority, due_date, title, description, id]);
                    message = "Task updated successfully";
                    break;
                case 'DELETE':
                    result = await tenantDb.query(`
                                                UPDATE tasks SET
                                                is_deleted=true,
                                                deleted_at=NOW()
                                                WHERE id=$1
                                                RETURNING *`, [id]);
                    message = "Task deleted successfully";
                    break;
            }
            await tenantDb.query('COMMIT');
            return {message, data: [result.rows][0]};
    }catch(error){
        console.error("Error in tasks:", error);
        await tenantDb.query('ROLLBACK');
        throw error;
    }
    }
}