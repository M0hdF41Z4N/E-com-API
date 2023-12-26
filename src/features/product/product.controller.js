import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository();
    }


    async getAllProducts(req,res) { 
        try {
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        } catch (error) {
            console.log('error :', error);
            return res.status(400).send(err.message);
        }
    }

    async addProduct(req, res) { 
        try {
            const {name,price,sizes} = req.body;
            const newProduct = {
                name,
                price:parseFloat(price),
                sizes: sizes?.split(','),
                imageURL: req?.file?.filename,
            };
            const createdProduct = await this.productRepository.add(newProduct);
            res.status(201).send(createdProduct);
        } catch (error) {
            console.log('error :', error);
            return res.status(400).send(err.message);
        }
    }

    
    async getOneProduct(req,res) {
        try {
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if (!product) { 
                return res.status(404).send("Product not found");
            }
            return res.status(200).send(product);
        } catch (error) {
            console.log('error :', error);
            return res.status(400).send(err.message);
        }
    }
    
    async rateProduct(req, res) {
        try {
            const {productID,rating} = req.body;
            const userID = req.userID;
            // ProductModel.rateProduct(userID, productID, rating);
            await this.productRepository.rateProduct(userID, productID, rating);
            return res.status(200).send(
                "Rating has been added");
        }catch(err) { 
            return res.status(400).send(err.message);
            // next(err); // we can do this as well to call application level error handler
        }
    }

    async filterProducts(req,res) {
        try {
            const {minPrice,maxPrice,category} = req.query;
            // const Products = ProductModel.filter(
            //     minPrice,maxPrice,category
            //     );
            const Products = await this.productRepository.filter(minPrice,maxPrice,category);
            if (!Products) { 
                return res.status(404).send("Products not found");
            }
            return res.status(200).send(Products);
            
        } catch (error) {
            console.log('error :', error);
            return res.status(400).send(error.message);
        }
    }

    async averagePrice(req,res,next) {
        try {
            const result = await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);
        } catch (error) {
            console.log('error :', error);
            return res.status(400).send(error.message);
        }
    }
}

// TODO 
// add validations using express validator similarly to all features
// Error handling using try catch