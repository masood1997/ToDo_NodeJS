import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.js';
import taskRouter from './routes/task.js';
import { errorHandler } from './middlewares/error.js';

config({ path: './data/config.env' });

const app = express();

// Middlewares

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);
app.use(cookieParser());

//Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/task', taskRouter);

app.get('/api/v1/info', (req,res)=>{
res.status(200).json({
  success:"true",
  message:"About",
  info:" This backend server stores and sends blog posts. It is created by Masood Rehman"
})
})

app.get('/', (req, res) => {
  res.send(' Server is Working');
});

//Error Handler
app.use(errorHandler);
export default app;
