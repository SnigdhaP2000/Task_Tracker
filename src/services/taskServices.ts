import express,{ Request } from 'express';
import { CustomRequest } from "../middlewares/tenantMiddleware";

export default class TaskService {
    public healthCheck = async (req: CustomRequest)=> {
        const {tenantDb}=req;
        const result =await tenantDb.query("SELECT NOW()");
        return result;
    }

    public tasks =async(req: CustomRequest)=>
    {
        const {body={}, method, query, tenantDb}=req;
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
        try
        {
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
                        assigned_by=COALESCE($1, assigned_by),
                        assigned_to=COALESCE($2, assigned_to),
                        status=COALESCE($3, status),
                        priority=COALESCE($4, priority),
                        due_date=COALESCE($5, due_date),
                        title=COALESCE($6, title),
                        description=COALESCE($7, description),
                        updated_at =NOW()
                        WHERE id=$8
                        RETURNING *`,
                        [assignee? assignee: null,
                            assigned_to? assigned_to: null, 
                            status? status: null, 
                            priority? priority: null,
                            due_date? due_date: null,
                            title? title: null, 
                            description? description: null, 
                            id]);
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

    public taskComments =async(req: CustomRequest)=>{
        const {body={}, method, query, tenantDb}=req;
        const {comment, user_id}=body;
        const {id}=query;
        await tenantDb.query('BEGIN');
        let result;
        let message;
        try
        {
            switch (method) 
            {
                case 'GET':
                    result = await tenantDb.query(`
                                                    SELECT 
                                                    tc.comment,
                                                    tc.created_at, 
                                                    u.name,
                                                    u.email
                                                    FROM task_comments tc
                                                    INNER JOIN users u ON u.id=tc.created_by
                                                    WHERE 
                                                    tc.is_deleted=false 
                                                    AND tc.task_id=$1
                                                    AND u.is_deleted=false
                                                    AND u.is_suspended=false`, [id]);
                    message = "Task comments fetched successfully";
                    break;
                case 'POST':
                    result = await tenantDb.query(`
                        INSERT INTO task_comments 
                        (task_id, comment, created_by) 
                        VALUES ($1, $2, $3) 
                        RETURNING *`, 
                        [id, comment, user_id]);
                    message = "Task comment created successfully";
                    break;
                case 'PATCH':
                    result = await tenantDb.query(`
                        UPDATE task_comments SET
                        comment=$1
                        WHERE                         
                        task_id=$2
                        AND is_deleted=false
                        RETURNING *`,
                        [comment, id]);
                    message = "Task comment updated successfully";
                    break;
                case 'DELETE':
                    result = await tenantDb.query(`
                                                UPDATE task_comments 
                                                SET
                                                is_deleted=true,
                                                deleted_at=NOW()
                                                WHERE 
                                                task_id=$1
                                                RETURNING *`, [id]);
                    message = "Task comment deleted successfully";
                    break;
            }
            await tenantDb.query('COMMIT');
            return {message, data: [result.rows][0]};
        }catch(error){
            console.error("Error in taskComments:", error);
            await tenantDb.query('ROLLBACK');
            throw error;
        }
    }

    public taskFilters =async(req: CustomRequest)=>{
        const {tenantDb}=req;
        let message;
        const result =await tenantDb.query(`
                                            SELECT 
                                            types.typname AS filter_type,
                                            to_json(ARRAY_AGG(enums.enumlabel ORDER BY enums.enumsortorder)) AS values
                                            FROM 
                                            information_schema.columns cols
                                            JOIN 
                                            pg_type types ON cols.udt_name = types.typname
                                            JOIN 
                                            pg_enum enums ON types.oid = enums.enumtypid
                                            WHERE 
                                            cols.table_name = 'tasks'
                                            AND cols.data_type = 'USER-DEFINED'
                                            GROUP BY 
                                            types.typname`);
        message = 'Filters fetched successfully';
        return {message, data: [result.rows]};
    }

}