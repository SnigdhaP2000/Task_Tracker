import express from 'express';
import taskRoutes from './src/routes/taskRoutes';
const app = express();
const port = 3001;

app.use(express.json());

app.use("/api", taskRoutes);

app.listen(port, ()=>{
    console.log(`task tracker server running on port ${port}`)
})


