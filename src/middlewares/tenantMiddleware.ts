import { Request, Response, NextFunction } from "express";
import { connectToDB } from "../services/awsServices";

export interface CustomRequest extends Request {
  tenantDb?: any; 
}

export const tenantMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { "client-token": clientToken } = req.headers;
    if(clientToken === undefined) 
      {
        throw new Error("client-token header is missing");
      }    
    const client = await connectToDB(clientToken as string);
    const resDB = await client.query("SELECT NOW()");
    console.log("Current Time:", resDB.rows[0]);
    req["tenantDb"] = client;
    next();
  } catch (error) {
    console.error("TenantMiddleware Error:", error);
    res.status(500).json({ error: "Internal Server Error in TenantMiddleware"+error });
  }
};
