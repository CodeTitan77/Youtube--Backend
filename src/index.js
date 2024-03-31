import dotenv from  "dotenv";
import express from "express";


dotenv.config({
    path:'./env'
})

const app= express();


import connectDB from './db/index.js';


 connectDB().then(()=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log("server started");
    })

 })

 .catch((err)=>{

    console.log("connection failed db")
 })