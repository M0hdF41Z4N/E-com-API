
// Manage routes/paths to product controller
import express from 'express';
// Importing product contoller
import {cartItemsController} from './cartItems.controller.js';

// Initializing router
const CartRouter = express.Router();
// creating controller instance
const CartController = new cartItemsController();

// Routes
CartRouter.post('/' ,CartController.add);
CartRouter.get('/' ,CartController.get);
CartRouter.delete('/:cartItemID' ,CartController.delete);
CartRouter.get('/' , (req,res) => { 
    CartController.get(req,res) 
});
CartRouter.post('/' ,(req,res) => {
    CartController.add(req, res)
});
CartRouter.delete('/:cartItemID' ,(req, res) => {
    CartController.delete(req, res);
});

export default CartRouter;