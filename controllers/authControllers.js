import User from "../models/userSchema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"

export const cookieOption = {
    expires: new Date(Date.now()+3 *24 *60*60*1000),
    httpOnly: true,
    //make seprate file in util
}


/*
$ignup
$route http://
$description(new user)
$paremeters(name,email,password) 
$return user object
*/

export const signup = asyncHandler(async(req,res)=>{
  const{name, email, password} = req.body

  if(!name || !email ||!password){
   throw new CustomError("please fill all fields",400)
  }
  //if user exists
  const existingUser = await User.findOne({email})

  if(existingUser){
    throw new CustomError("user already exists",400)
  }

  const user = await User.create({
    name: name,
    email:email,
    password: password,
  })
  const token = user.getJwtToken()
  user.password = undefined;

  res.cookie("token",token,cookieOption)
  
  res.status(200).json({
    success:true,
    token,
    user
  })
})



/*
$login
$route http://
$description(login user)
$paremeters(email,password) 
$return user object
*/


export const login = asyncHandler(async(req,res)=>{

    const{ email, password} = req.body

    if(!email ||!password){
     throw new CustomError("please fill all fields",400)
    }

   const user = User.findOne({email}).select("+password ")
    
   if(!user){
    throw new CustomError("invalid credentials",400)
   }

   const isPasswordMatched = await user.comparePassword(password)

   if(!isPasswordMatched){
          const token = user.getJwtToken()
          user.password = undefined;
          res.cookie("token",token,cookieOption)
         return res.status(200).json({
            success: true,
            token,
            user
         })
   }
   throw new CustomError("invalid credentials-pass",400)
})

 /*
$logout
$route http://5000
$description :user logout
$paremeters 
$return success message
*/

export const logout = asyncHandler(async(_req,res)=>{
    res.cookie("token",null,{

        expires: new Date(Date.now()),
        httpOnly:true
    })
      req.status(200).json({
        success:true,
        message: "logged out"
      })
    })


     /*
$forget password
$route http://5000
$description :user logout
$paremeters 
$return success message
*/

