import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const db_url = process.env.MONGODB_URL;
export const connectUsingMongoose = async()=>{
    try{
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongodb connected using mongoose");
    }catch(err){
        console.log("Error while connecting to db");
        console.log(err);
    }
}