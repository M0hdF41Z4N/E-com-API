import mongoose from "mongoose";
const { Schema } = mongoose;

export const productSchema = new Schema({
    name : String,
    price : Number,
    category : String,
    description : String,
    inStock : Number
})