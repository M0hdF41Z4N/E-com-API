import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { cartSchema } from "./cartItems.schema.js";

const CartModel = mongoose.model('Cart',cartSchema);


class CartRepository {

    async add(productID,userID,quantity) {
        try {
            const id = await this.getNextCounter(db);
            await CartModel.updateOne(
                {
                    productID : new ObjectId(productID) ,
                    userID: new ObjectId(userID) ,
                },
                {
                    $setOnInsert:{_id :id},
                    $inc : {quantity: quantity}
                },
                {upsert: true}
            )
        } catch (error) {
            throw new ApplicationError("Something went wrong",500);   
        }
    }
    // async add(productID,userID,quantity) {
    //     try {
    //         // connecting to DB
    //         const db = getDB();
    //         // Getting collection
    //         const cart = await db.collection('cart'); 
    //         const id = await this.getNextCounter(db);
    //         await cart.updateOne(
    //             {
    //                 productID : new ObjectId(productID) ,
    //                 userID: new ObjectId(userID) ,
    //             },
    //             {
    //                 $setOnInsert:{_id :id},
    //                 $inc : {quantity: quantity}
    //             },
    //             {upsert: true}
    //         )
    //     } catch (error) {
    //         throw new ApplicationError("Something went wrong",500);   
    //     }
    // }

    async delete(cartItemID,userID) {
        try {
           
            // await cart.updateOne({ userID: new ObjectId(userID) },
            // {
            //     $pull : { productID : new ObjectId(productID) }
            // })

            await CartModel.deleteOne({ 
                userID: new ObjectId(userID),
                _id : new ObjectId(cartItemID)
             });

        } catch (error) {
            throw new ApplicationError("Something went wrong",500); 
        }
    }
    // async delete(cartItemID,userID) {
    //     try {
    //         const db = getDB();
    //         // Getting collection
    //         const cart = await db.collection('cart');
    //         // await cart.updateOne({ userID: new ObjectId(userID) },
    //         // {
    //         //     $pull : { productID : new ObjectId(productID) }
    //         // })

    //         await cart.deleteOne({ 
    //             userID: new ObjectId(userID),
    //             _id : new ObjectId(cartItemID)
    //          });

    //     } catch (error) {
    //         throw new ApplicationError("Something went wrong",500); 
    //     }
    // }

    async getAll(userID) { 
        try {
            // finding all items of user
            const items = await CartModel.find({userID: new ObjectId(userID) }).toArray();
            return items;
        } catch (error) {
            throw new ApplicationError("Something went wrong",500);
        }
    }
    // async getAll(userID) { 
    //     try {
    //         // connecting to DB
    //         const db = getDB();
    //         // Getting collection
    //         const cart = await db.collection('cart');

    //         // finding all items of user
    //         const items = await cart.find({userID: new ObjectId(userID) }).toArray();
    //         return items;
    //     } catch (error) {
    //         throw new ApplicationError("Something went wrong",500);
    //     }
    // }

    async get(userID) {
        try {
            // finding all items of user
            const items = await CartModel.find({userID: new ObjectId(userID) }).toArray();
            return items;
        } catch (error) {
            throw new ApplicationError("Something went wrong",500);
        }
    }
    // async get(userID) {
    //     try {
    //         // connecting to DB
    //         const db = getDB();
    //         // Getting collection
    //         const cart = await db.collection('cart');

    //         // finding all items of user
    //         const items = await cart.find({userID: new ObjectId(userID) }).toArray();
    //         return items;
    //     } catch (error) {
    //         throw new ApplicationError("Something went wrong",500);
    //     }
    // }

    async getNextCounter(db) {
        const counter = await db.collection('counter')
        .findOneAndUpdate(
            {_id:'cartItemId'},
        {$inc:{value:1}},
        {returnDocument}
        )

        return counter.value.value;
    }
}

export default CartRepository;