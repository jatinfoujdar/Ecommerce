import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name :{
            type:String,
            required:[true,"Name is required"],
            maxLength:[20,"Name must be less than 20"],
            trim:true
        }
    }
)