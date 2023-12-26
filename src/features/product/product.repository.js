import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


class ProductRepository {

    async add(newProduct) {
        try {
            const db = getDB();
            const collection = await db.collection('products');
            await collection.insertOne(newProduct);
            return newProduct;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Unable to add new Product",500);
        }
    }

    async getAll() {
        try {
            const db = getDB();
            const collection = await db.collection('products');
            const products = await collection.find({}).toArray();
            return products;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong",500);
        }
    }

    async get(id) {
        try {
            const db = getDB();
            const collection = await db.collection('products');
            const product = await collection.findOne(
                { _id : new ObjectId(id) }
                );
            return product;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong",500);
        }
    }

    async filter(minPrice, maxPrice,category) {
        try {
            const db = getDB();
            const Product = await db.collection('products');
            const filterExpression = {};
            if (minPrice || maxPrice) {
                if (minPrice && maxPrice) {
                    filterExpression.price = {
                        $gte : parseFloat(minPrice),
                        $lte : parseFloat(maxPrice)
                    }
                }
                if (minPrice) {
                    filterExpression.minPrice = {$gte : parseFloat(minPrice)};
                }
                if (maxPrice) {
                    filterExpression.price = {$lte : parseFloat(maxPrice)};
                }
            }
            if (category) { 
                filterExpression.category = category;
            }

            const filteredProducts = await Product.find(filterExpression).toArray();;

            // const filteredProducts = await Product.filter({
            //         $or : [
            //             {price : {$gte : minPrice}},
            //             {price : { $lte : maxPrice}},
            //             {category : category}
            //         ]
            // }).toArray();
            return filteredProducts;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong",500);
        }
        
    }

    async rateProduct(userID,productID,rating){
        try {
        const db = getDB();
        const users = await db.collection('users');
        const user = await users.findOne({ _id : new ObjectId(userID)});
        
        if (!user) {
            // user defined error
            throw new  ApplicationError('User not found',404);
        }
        const products = await db.collection('products');
        const product = products.findOne({ _id : 
            new ObjectId(productID) });
        
        if (!product) { 
            // user defined error
            throw new  ApplicationError('Product not found',400);
        }

        // To handle inconsistency in database

        // if any rating exists just remove it
        await products.updateOne(
            { _id : new ObjectId(productID) }
            ,
            {
                $pull: {ratings:{userID: new ObjectId(userID)}}
            }
        );

        // Create new entry
        await products.updateOne({ _id : new ObjectId(productID) }, {$push: 
            {ratings: {userID: new ObjectId(userID), rating}}
        });


        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong",500);
        }
    }

    async averageProductPricePerCategory() {
        try {
            const db = getDB();
            return await db.collection('products')
            .aggregate([
                // stage 1: Get average price per category
                {
                    $group : {
                        _id : '$category',
                        averagePrice:{$avg : "$price" }
                    }
                }
            ]).toArray();
             
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong",500);
        }
    }
}

export default ProductRepository;