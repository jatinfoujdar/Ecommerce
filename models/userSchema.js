import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/index";


const userSchema = mongoose.Schema(
    {
        name :{
            type:String,
            required:[true,"Name is required"],
            maxLength:[20,"Name must be less than 20"],
            trim:true
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:[true,"password is required"],
            minLength:[10,"password must be at least 10 char"],
            select:false
        },
        role:{
            type:String,
            enum: Object.values(AuthRoles),
            default: AuthRoles.USER
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry : Date,
    },
    {
        timestamps:true,
    }
);

//encrypt password hooks
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
//add more feature directly to schema
userSchema.method={
    //compare password
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    },
    //generate jwt token
       getJwtToken: function(){
        return JWT.sign(
            {
                _id: this._id,
                role: this.role
            },
            config.JWT_SECRET,
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    },
    generateForgetPasswordToken: function(){
        const forgetToken =  crypto.randomBytes(20).toString('hex');

        //1save to db
        this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(forgetToken)
        .digest("hex") 

        this.forgotPasswordExpiry = Date.now() + 20 + 60*1000
        //2return values to user

        return forgetToken;

    }
}


export default mongoose.model("User",userSchema);