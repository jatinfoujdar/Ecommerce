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

   const collection = await Collection.create({
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
//existing value to be updates
    const {id:collectionId} = req.params

//new value to get updated
    const {name} = req.body

    if(!name){
        throw new CustomError("Collection name is required",400)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name
        },
        {
            new: true,
            runValidators: true,
        }
    )

    if(!updateCollection){
        throw new CustomError("Collection not found",400)
    }


    //send response
    req.satus(200).json({
        success: true,
        message: "collection updated successfully",
        updateCollection
    })
})


export const deleteCollection = asyncHandler(async(req,res)=>{
    
    const {id:collectionId} = req.params

    const collectionToDelete = await Collection.findByIdAndDelete(collectionId)

    if(!collectionToDelete){
        throw new CustomError("Collection not found",400)
    }

    req.satus(200).json({
        success: true,
        message: "collection Deleted successfully",
        collectionToDelete
    })

})


export const getAllCollection = asyncHandler(async(req,res)=>{
   const collections =  await Collection.find()

   if(!collections){
    throw new CustomError("No Collecton found ",400)
   }

   res.satus(200).json({
        success: true,
        message: "collections All list successfully",
        collections
   })
})