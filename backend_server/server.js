import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRouter from "./Route/authroute.js";
import rankRouter from "./Route/rankRoute.js";
import analysisRouter from "./Route/analysisRoute.js";
import  startRankTrackingCron from "./cron/rankTrackingCron.js";

connectDB()
const app = express()

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://seo-rank-tracker-cyan.vercel.app'  // Your FRONTEND URL
    ],
    credentials: true
}));app.use(express.json())

app.get('/',(req,res)=> res.send("Server is running"))
app.use("/api/auth", authRouter)
app.use("/api/rank",rankRouter)
app.use("/api/analysis", analysisRouter)

// Start cron jobs
startRankTrackingCron

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))