import { MongoClient } from "mongodb";


const db_url = process.env.MONGODB_URL;
// const db_url = "mongodb://127.0.0.1:27017/ecomdb";

let client;

export const connectToMongoDB = () => {
    MongoClient.connect(db_url)
    .then( clientInstance => {
        client = clientInstance;
        console.log("Connected to MongoDB");
        createCounter(client.db());
        createIndexes(client.db());
    })
    .catch(err => { console.log("Error connecting", err); });
}

export const getDB = () => {
    return client.db(); // this takes the db name as argument as well
}

export const getClient = () => { 
    return client; 
}

const createCounter = async (db) => {
    const existingCounter = await db.collection('counters')
    .find({ _id : 'cartItemId'});
    if (!existingCounter){
        await db.collection('counters').insertOne({ 
            _id : 'cartItemId' , value:0
        }); 
    }
}

const createIndexes = async (db) => {
    try {
        const products = await db.collection('products');
        await products.createIndex({price:1});
        await products.createIndex({name:1,category:-1});
        // await products.createIndex({desc:"text"});
    } catch (error) {
        console.log('error :', error);
    }
}
