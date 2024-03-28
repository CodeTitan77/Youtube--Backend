import mongoose, { connections } from "mongoose";
import { DB_NAME } from './../constant.js';
 const connectDB = async ()=>{
    try{
       const connectionINstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      
        console.log(`db connected DB HOST : ${connectionINstance.connection.host}`);
   


    }
    catch(err){
        console.log("failed in database connection",err);
        process.exit(1);

    }

 }
 export default connectDB;