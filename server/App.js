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
const port = process.env.PORT || 8009;

ConnectDB();

// res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict"
// });

// Middlewares
app.use(express.json())
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Origin not allowed by CORS"));
        }
    },
    credentials: true,
}));
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
