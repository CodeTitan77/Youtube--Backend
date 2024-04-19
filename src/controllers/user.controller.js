import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    const coverImageLocalPath= req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file required ")

    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)
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
        new ApiResponse(200, createdUser,"USer registered succesfully")

     )


} )


export  {registerUser}