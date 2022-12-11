import mongoose from "mongoose"
import app from "./app.js"
import config from "./Backend/config/index"

//IIFY
//conect to a database
(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB CONNECTED");

        app.on("error",(err)=>{
            console.log("error",err);
            throw err;
        })
        const onListening = ()=>{
            console.log(`listening on${config.PORT}`);
        }

        app.listen(config.PORT, onListening)

    } catch (err) {
        console.log("error",err);
        throw err
    }
})()





