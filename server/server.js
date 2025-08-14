import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'
import connectMongoDB from "./config/mongoDB.js";
import authRouter from "./routes/authRoute.js";
import transactionRouter from "./routes/transactionRoute.js";
import goalRouter from "./routes/goalsRoute.js";


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000 

connectMongoDB() ;

// middleware
app.use(cors())
app.use(express.json())

// All Router
app.use('/api/auth',authRouter)
app.use('/api/transaction',transactionRouter)
app.use('/api/goal',goalRouter)



// API Endpoint
app.get('/', (req, res) => {
    res.send("FUNFUSION");
});

// port listening
app.listen(PORT,() => console.log(`✅ Backend is working on ${PORT}`))


