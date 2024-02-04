import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import router from "./routes/auth.js";
dotenv.config();

const app = express(); 
app.use(express.json())
app.use('/server/auth', router)

    app.use((err,req,res,next)=>{
const statuscode=err.statuscode||500;
const message=err.message||'internal server error';
return res.status(statuscode).json({
    success:false,
    statuscode,
    message,
});
    })

mongoose.connect(process.env.mongose).then(() => {
    console.log('connected to mongodb');
}).catch((err) => {
    console.log(err);
})
app.listen(3000, () => {
    console.log('server is running on 3000');
});