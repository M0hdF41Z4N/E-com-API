
// Manage routes/paths to product controller
import express from 'express';
// Importing product contoller
import ProductController from './product.controller.js';
import {upload} from '../../middlewares/fileupload.middleware.js'

// Initializing router
const ProductRouter = express.Router();
// creating controller instance
const productController = new ProductController();

// Routes

// With Repository pattern
ProductRouter.get('/', (req, res) => {
    productController.getAllProducts(req, res);
});
ProductRouter.get('/filter',(req, res) => {
    productController.filterProducts(req, res);
});
ProductRouter.get('/:id',(req, res) => {
    productController.getOneProduct(req, res);
});
ProductRouter.post('/', upload.single('imageUrl') ,
(req, res) => {
    productController.addProduct(req,res)
});

ProductRouter.post('/avgPrice' ,
(req, res) => {
    productController.averagePrice(req, res,next);
});

ProductRouter.post('/rate' ,
(req, res) => {
    productController.rateProduct(req, res);
});


// ProductRouter.get('/', productController.getAllProducts);
// ProductRouter.get('/filter', productController.filterProducts);
// ProductRouter.get('/:id', productController.getOneProduct);
// ProductRouter.post('/', upload.single('imageUrl') ,productController.addProduct);
// ProductRouter.post('/rate' ,productController.rateProduct);


export default ProductRouter;