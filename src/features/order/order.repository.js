import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
    constructor() {
        this.collection = "orders";
    }

    async placeOrder(userId) {
        const client = getClient();
        const session = client.startSession();
        try {
            const db = getDB();
            // Getting cart items
            const items = await this.getCartItems(userId,session);
            // Totalling the amount and storing order in DB
            const totalAmount = items.reduce((totalAmount, item) => totalAmount + item , 0);
            const newOrder = new OrderModel(new ObjectId(userId), totalAmount,new Date());
            const order =  await db.collection('orders');
            order.insertOne(newOrder,{session});
            // Reduce the stock
            for (let item of items) { 
                await db.collection('products').updateOne(
                    { _id : item.productID},
                    {$inc:{stock: -item.quantity}}, {session}
                )
            }
            // Clear the cart items
            await db.collection('cart').deleteMany({
                userId: new ObjectId(userId)
            }, {session})
            
            // committing transaction
            session.commitTransaction();
            // Ending session
            session.endSession();

            return;

        } catch (error) {
            // Aborting transaction
            await session.abortTransaction();
            // Ending session
            session.endSession();
        }
    }

    async getCartItems(userId,session) {
        try {
            const db = getDB();
            
            const items = await db.collection("cart")
            .aggregate([
                // Getting cart items for the user
                {
                    $match: {userId: new ObjectId(userId)}
                },
                {
                    // Getting products from products collection
                    $lookup: {
                        from : "products",
                        localField: "productID",
                        foreignField: "_id",
                        as:"productInfo"
                    }
                },
                // Unwind the productInfo
                {
                    $unwind: "productInfo"
                },
                // Calculate total amount for each items
                {
                    $addFields: {
                        "totalAmount": {
                            $multiply:["productInfo.price","$quantity"]
                        }
                    }
                }

            ],{session}).toArray();

            return items;

        } catch (error) {
            
        }

    }
}