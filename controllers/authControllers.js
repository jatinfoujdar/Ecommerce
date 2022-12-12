import User from "../models/userSchema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import mailHelper from "../utils/mailHelper"
import crypto from "crypto"

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

   const user = await User.findOne({email}).select("+password ")
    
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
$description :user will submit the email and we will generate a token
$paremeters  email
$return success message - = email send
*/

export const forgotPassword = asyncHandler(async(req,res) =>{
   const {email} = res.body
  const user = await User.findOne({email})
   if (!user) {
     throw new CustomError("user not find",404)
   }
    const resetToken = user.generateForgetPasswordToken()

     await user.save({validateBeforeSave: false})

     const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`

     const text = `your password reset link is \n\n
     ${resetUrl}\n\n`

     try {
      await mailHelper({
        email: user.email,
        subject: "reset password email ",
        text: text,
      })
      res.status(200).json({
        success:true,
        message: `email send to ${user.email}`
      })
     } catch (error) {
      //roll back - clear fields and save
      user.forgotPasswordToken = undefined
      user.forgotPasswordExpiry= undefined

      await user.save({validateBeforeSave: false})

      throw new CustomError(error.message || "email sent failure",500)

     }

})


     /*
$reset password
$route http://5000
$description :user will reset password based on url token
$paremeters  token from url , pass ,confirm pass
$return success message - = user object
*/


export const resetPassword = asyncHandler(async(res,req)=>{
  const {token:resetToken} = req.params
  const {password,confirmPassword} = req.body

   const resetPasswordToken = crypto
   .createHash("sha256")
   .update(resetToken)
   .digest("hex")


    const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: {$gt: Date.now()}

   })
   if (!user) {
    throw new CustomError("password token is invalid or expired",400)
   }

   if (password != confirmPassword) {
    throw new CustomError("password and conf password does not match",400)
   }
 
   user.password = password
   user.forgotPasswordToken = undefined
   user.forgotPasswordExpiry = undefined

   await user.save()

   //create a token and response

   const token = user.getJwtToken()

   user.password = undefined

   res.cookie("token",token,cookieOption)
   res.status(200).json({
    success:true,
    user
   })
})