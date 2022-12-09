import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
      
    {
       products:{

        type:[{
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true,
            },
            count:Number,
            price:Number
        }],
        required:true
             
       },
       user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "USer",
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    coupon:String,
    transactionId: String,
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:[""]
        //improve !!!
    },
    //pay mode
    },
  {
    timeStamps:true
  }
)



export default mongoose.model("Order",orderSchema);