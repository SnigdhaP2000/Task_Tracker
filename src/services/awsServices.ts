import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Client } from "pg";

const ssm = new SSMClient({ region: "ap-south-1" });

async function getParam(name: string): Promise<string> {
  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true,
  });
  const res = await ssm.send(command);
  return res.Parameter?.Value || "";
}

export async function connectToDB(dbName: string){
  const [host, port, user, password, database] = await Promise.all([
    getParam("/tasktracker/db/host"),
    getParam("/tasktracker/db/port"),
    getParam("/tasktracker/db/user"),
    getParam("/tasktracker/db/password"),
    getParam("/tasktracker/db/database"),
  ]);
  const client = new Client({
    host,
    port: parseInt(port),
    user,
    password,
    database:dbName,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  console.log("✅ Connected to DB");

  return client;
}
