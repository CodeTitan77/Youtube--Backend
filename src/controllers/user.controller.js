import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

      
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}




// get user deatils 
// validation
// already exist  check : username,email
//check for images , check for avatar 
//upload to cloudinary 
//crate user object to mongo db// entry in db
// dont sent password or refresh token 
//check user connection 
//return res


const registerUser = asyncHandler( async (req, res) => {
   const {fullName,email,username,password} = req.body;
   if(fullName=== ""){
    throw new ApiError(500,"fullname is req")
   }
   if(email=== ""){
    throw new ApiError(500,"email is req")
   }
   if(username=== ""){
    throw new ApiError(500,"username is req")
   }
   if(password=== ""){
    throw new ApiError(500,"password is req")
   }
// if (
//     [fullName, email, username, password].some((field) => field?.trim() === "")
// ) {
//     throw new ApiError(400, "All fields are required")
// }
    const existedUser= await User.findOne({
        $or: [{username},{email}]  // or operator
        
    })
    if(existedUser){
        throw new ApiError(409,"user already existed")
    }
    // multer giving access of these video or image files like req.body is given by express

    const avatarLocalPath=req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file required ")

    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"Avatar file required ")
    }
   const user=  await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username.toLowerCase()

    })
    // select method is used to remove password and refreshed token 
       // wo string me likhna hai jo remove karna hai 
    const createdUser = await User.findById(user._id).select (
        "-password -refreshToken"
    )
    if(!createdUser)
    {
     throw new ApiError(500,"user object cant be created")
     }
     return res.status(201).json(
        new ApiResponse(200, createdUser,"User registered succesfully")

     )


} )


 const loginUser = asyncHandler(async(req,res)=>{
    // take data from req.body
    // check if username or email already exist in the data base
    //password check 
    //generate both access and refresh token 
    //send cookie
     const {email,username,password}= req.body;

     if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
     const user = await User.findOne({
        $or:[{username},{email}]
     })
    
     if(!user){
        throw new ApiError(404,"User does not exist")
     }
      const isPasswordValid = await user.isPasswordCorrect(password);
      
      if(!isPasswordValid){
        throw new ApiError(401,"Invalid password credentials")
      }
     const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user._id);
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")// swelect is used to delete fields from the user object 
     // the ones we don't want to send the user 
     const options= {
        httpOnly: true, 
        secure : true ,
     }// only modifiable by server 
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully "
        )
    )// for local storage 





 })


 const logoutUser = asyncHandler(async(req,res)=>{
    // i can access req.user because of auth middle ware which i added 
 await  User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken : undefined
        }
    },
    {
        new : true
    }
  )
  const options ={
    httpOnly:true,
    secure:true
  }
  return res.status(200).clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200, "user logged out"))
 })









export  {
    registerUser,
    loginUser, 
    logoutUser,
}