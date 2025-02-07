import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import ConnectDB from './config/db.js';
import authRoutes from './Routes/authRoutes.js'
import taskRoutes from './Routes/taskRoutes.js'
import helmet from "helmet";
import { loginLimiter } from "./middleware/rateLimit.js";

// Load envioroment variables
dotenv.config();

const app = express();
const port =  8009;

ConnectDB();

// res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict"
// });

// Middlewares
app.use(express.json())
const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'https://todo-app-henna-phi.vercel.app/',
        'http://localhost:3000',
      ];
      if (!origin) {
        // Permitir solicitudes desde herramientas como Postman, pero no desde navegadores sin origen
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  
  app.use(cors(corsOptions));
  
  // Permitir preflight requests
  app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.status(200).end();
  });
app.use(cookieParser());
app.use(helmet());

// Routes
app.use("/api/auth", authRoutes);

// Add task
app.use("/api/tasks", taskRoutes);

// Route test
app.use('/', (req, res) => {
    res.send('api is rununig ....')
})

app.listen(port, () => {
    console.log(`Helloooooo wrold from the port ${port}`);
});
