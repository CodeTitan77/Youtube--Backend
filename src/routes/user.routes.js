import { Router } from "express";
import  {registerUser}  from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
// file handling multer used in routes as middleware 
// in form we are also sending image files 
router.route("/register").post(
    upload.fields([
        {
         name: "avatar", 
         maxcount : 1  // front end ka field bhi same name ka hoga
        },
        {
         name : "coverImage",
           maxcount:1
        }

    ]),
    registerUser)



export default router