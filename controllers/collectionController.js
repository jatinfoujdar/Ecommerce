import Collection from "../models/collectionSchema"
import CustomError from "../utils/customError"
import asyncHandler from "../services/asyncHandler"

/*
$create collection
$route http://
$description()
$paremeters() 
$return 
*/
export const createCollection = asyncHandler(async(req,res)=>{
 //take name from frontend
    const {name} = req.body

    if(!name){
        throw new CustomError("Collection name is required",400)
    }
    //add this to database

   const collection = Collection.create({
        name
        })

        //send this res value to frontend
        res.satus(200).json({
            success:true,
            message: "Collection create with success",
            collection
        })
})


export const updateCollection = asyncHandler(async(req,res)=>{

    



})