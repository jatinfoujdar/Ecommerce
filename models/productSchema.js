import mongoose from "mongoose";

const productSchema = new mongoose.productSchema(
    {
    name:{
        type:String,
        required:[true,"provide a product name"],
        trim:true,
        maxLength:[120,"product name should be in 120 char "]
    },
    price:{
        type:Number,
        required:[true,"provide a product price"],
        maxLength:[6,"product price should not be more than 6 num "]
    },
    description:{
        type:String,
    //use editor - PA       
    },
    photos:[
        {
        url:{
            type:String,
            required:true
           }
    }
  ],
  stock:{
    type:Number,
    default:0
  },
  sold:{
    type:Number,
    default:0
  },
 
  collectionId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection"
  }
},
   {
    timestamps:true
   }
)


export default mongoose.model("Product",productSchema);