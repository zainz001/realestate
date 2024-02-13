import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import router from "./routes/auth.js";
import routers from "./routes/userroutes.js";

import listing from "./routes/listingroutes.js";
dotenv.config();

const app = express(); 
app.use(express.json());
app.use(cookieParser());

// Define routes after cookieParser
app.use('/server/auth', router);
app.use('/server/userroutes', routers);
app.use('/server/listing', listing);

app.use((err, req, res, next) => {
    const statuscode = err.statuscode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statuscode).json({
        success: false,
        statuscode,
        message,
    });
});

mongoose.connect(process.env.mongose).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log('Server is running on 3000');
});
