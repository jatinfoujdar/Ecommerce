import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";

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

export default mongoose.model("User",userSchema);