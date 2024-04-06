
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));
app.use(express.json({
    limit:"16kb"  // limit is imp otherwise server can crash
                      // used so that we can take json data 
}))
app.use(express.urlencoded({extended: true,limit : "16kb"}))// for object
app.use(express.static("public"))// for assets
app.use(cookieParser())

// routes import 
import userRouter from'./routes/user.routes.js'
 app.use("/api/v1/users",userRouter)  //stiching route to routers






export {app}