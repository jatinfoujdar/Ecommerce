import mongoose from "mongoose";

const collectionSchemaCoupon = new mongoose.Schema(
    {
        code:{
            type:String,
            required: [true,"please enter the coupon name"]
        },
        discount:{
            type:Number,
            required: 0
        },
        active:{
            type:Boolean,
            required: true,
        },
        
    },
    {
        timestamps:true,
    }

)


export default mongoose.model("Coupon",collectionSchemaCoupon);