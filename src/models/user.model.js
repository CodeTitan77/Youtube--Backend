import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema= new Schema({
    username:{
        type:String ,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true

    },
    email:{
        type:String ,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,// whitespace are removed from db

    },
    fullName:{
        type:String ,
        required:true,
        trim : true,
        index:true


    },
    avatar : {
        type: String ,
        required: true,
    },
    coverImage:{
        type: String ,
        required: true,

    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video",

    }],
    password :{
        type: String,
        required: [true, 'Password is required'],// custom message 
    },
    refreshToken :{
        type: String ,
    },
   refreshToken:{
    type: String,
   } ,

}, {timestamps: true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
     return next();
    }
    this.password = bcrypt.hash(this.password, 10)
    next();


})// middleware kind of a hook 
// calling the fuunction as callback not using arrow function because arrow 
// function does not have refrence of this and here refrence is very imp 

userSchema.methods.isPasswordCorrect = async function(passord){
   return await  bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email: this.email,
        username: this.username,
        fullname:this.fullname

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY   
    })

}
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id : this._id,
       

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY   
    })
}


export const User = mongoose.model("User",userSchema)