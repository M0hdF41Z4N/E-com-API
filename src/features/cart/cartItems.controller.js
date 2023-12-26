import CartItemModel from "./cartItems.model.js";
import CartRepository from "./cartItems.repository.js";

export class cartItemsController {

    constructor () {
        this.cartRespository = new CartRepository();
    }


    add(req,res) {
        const {productID,quantity} = req.query;
        const userID = req.userID;
        // CartItemModel.add(productID,userID,quantity);
        this.cartRespository.add(productID,userID,quantity);
        res.status(200).send("Cart is updated");
    }

    get (req, res) { 
        const userID = req.userID;
        // const items = CartItemModel.getAll(userID);
        const items = this.cartRespository.getAll(userID);
        return res.status(200).send(items);
    }

    delete (req, res) { 
        const userID = req.userID;
        const {cartItemID} = req.params;
        // const error = CartItemModel.delete(cartItemID,userID);
        const error = this.cartRespository.delete(cartItemID,userID);
        if (error) {
            return res.status(404).send(error);
        }
        return res.status(201).send("Item deleted successfully");
    }
}