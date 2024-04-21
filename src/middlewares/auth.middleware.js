import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async(req,res,next)=>{
 try{
    const token = req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer","")// bearer ko replace kar ke empty string
   
    if(!token){
        throw new ApiError(401,"Unauthorized  request")
    }
   const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   const user= await User.findById(decodedToken?._id).select("-password -refeshToken");
   if(!user){
    throw new ApiError(401,"Invalid Access token")

   }
   req.user= user;
   next()
 }
 catch(error){
    throw new ApiError(401,error?.message || "Invalid access token");

 }
   
})
// req.cookies mein se ya header mein se cookie fetch ki 
//verifies if token is present and then use jwt verify and check if we have the same 
// secret key
// then verified from database if user is present or not 
