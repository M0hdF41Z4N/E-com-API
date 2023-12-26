import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
    constructor(id, name, desc,imageUrl  , category , price,sizes) {
        this._id = id;
        this.name = name;
        this.desc = desc;
        this.imageUrl = imageUrl;
        this.category = category;
        this.price = price;
        this.sizes = sizes;
    }

    static getAll() {
        return products;
    }

    static getById(id) { 
        const product = products.find(p => p.id == id);
        return product ;
    }

    static add(product) {
        product.id = products.length +1;
        products.push(product);
        return products;
    }

    static filter(minPrice, maxPrice,category) {
        const filterProducts = products.filter(product => {
            if (
                (!minPrice || product.price >= minPrice) &&
                (!maxPrice || product.price <= maxPrice) &&
                (!category || product.category == category))
                {
                    return product;
                }
        })

        return filterProducts;
    }

    static rateProduct(userID,productID,rating){
        const user = UserModel.getAll().find(user => user.id == userID);
        
        if (!user) {
            // user defined error
            throw new  ApplicationError('User not found',404);
        }
        
        const product = products.find(product => product.id == productID);
        if (!product) { 
            // user defined error
            throw new  ApplicationError('Product not found',400);
        }

        if(!product.ratings) {
            product.ratings = [];
            product.ratings.push({userID, rating});
        }else {
            const existingRatings = product.ratings.findIndex(rating => rating.userID == userID);
            if (existingRatings>=0) {
                product.ratings[existingRatings] = {
                    userID
                    , rating
                };
            }else {
                product.ratings.push({userID, rating});
            }
        }


    }


}


var products = [
    new ProductModel(
        123,
        "Nike Mercurial",
        'Football Shoes',
        "http://www.",
        "Men Shoes",
        4500,
        ["7,8,9"]
    ),
    new ProductModel(
        1,
        'Nike Vapor',
        'Football Shoes',
        'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
        'Men Shoes',
        19.99,
        ['M', 'XL']
      ),
      new ProductModel(
        2,
        'Adidas 2',
        'Description for Product 2',
        'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
        'Cateogory2',
        29.99,
        ['M', 'XL']
      ),
      new ProductModel(
        3,
        'Adidas 3',
        'Description for Product 3',
        'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
        'Cateogory3',
        39.99,
        ['M', 'XL','S']
      )
]