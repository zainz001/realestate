import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import router from "./routes/auth.js";
dotenv.config();

const app = express(); 
app.use(express.json())
app.use('/server/auth', router)



mongoose.connect(process.env.mongose).then(() => {
    console.log('connected to mongodb');
}).catch((err) => {
    console.log(err);
})
app.listen(3000, () => {
    console.log('server is running on 3000');
});