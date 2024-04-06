  const asyncHandler= (requesthandler)=> {
    return (req,res,next) =>{

    Promise.resolve(requesthandler).catch((err) =>next(err))
  }
 
  }









// const asyncHandler= (fn)=>async(req,res,next)=>{   //passing this function into another function

// try{
//     await fn(req,res,next);


// }
//     catch(err){
//         res.status(err.code||500).json({
//             success:false,
//             message : err.message,
//         })
//     }

// }


export default asyncHandler