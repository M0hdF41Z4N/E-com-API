import mongoose from "mongoose";
const { Schema } = mongoose;

export const userSchema = new Schema({
    name : {type: String , maxLength : [25,"Name can't be greater than 25 characters"]},
    email : {type : String , unique : true , required : true
    , match : [/.+\@.+\../,"Please enter a valid email address"]
    },
    password : { type : String
    //     , validator: function(value) {
    //         return /^(?=[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
    // },
    // message:"Please enter a valid password"
},
    type : {type : String, enum: ['Customer' , 'Seller']}
})