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