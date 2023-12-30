import './env.js'; // Environment variables should be the first thing to be loaded
// Importing express
import express from "express";
import bodyParser from "body-parser";
import swagger from "swagger-ui-express";
import cors from "cors";

// Importing product router
import ProductRouter from "./src/features/product/product.routes.js";
import UserRouter from "./src/features/user/user.routes.js";
// import authorizer from "./src/middlewares/basic.auth.js";
import jwtAuth from "./src/middlewares/jwt.auth.js";
import CartRouter from "./src/features/cart/cartItems.routes.js";
import apiDocs from "./swagger.json" assert {type:"json"};
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import {connectToMongoDB} from "./src/config/mongodb.js";
import { connectUsingMongoose } from './src/config/mongoose.js';
import OrderRouter from './src/features/order/order.routes.js';
// import AccessControlMiddleware from "./middleware/accessControlMiddleware.js";


// Creating servers
const server = express();


// Configuring Cors
// server.use(AccessControlMiddleware()); // cors solution using middleware
// Using library
server.use(cors({
    origin: 'http://localhost:5500'
    // allowedHeaders: ['Authorization']
}));

// Parser for form data
server.use(bodyParser.json())
// Parser for json Data
server.use(express.json())
const port = process.env.PORT || 3000;
server.use("/api-docs",swagger.serve,swagger.setup(apiDocs));
server.use(loggerMiddleware); // custom logging middleware
server.use("/api/cart",jwtAuth,CartRouter)
server.use("/api/products", jwtAuth ,ProductRouter);
server.use("/api/users",UserRouter);
server.use("/api/order",OrderRouter);

// Error handler middleware
function ErrorHandler(err, req, res, next) { 
     console.log('err :', err);
     if (e instanceof mongoose.Error.ValidationError) { 
         res.status(err.status).send(err.message);
    }
    if (err instanceof ApplicationError) {
        res.status(401).send(err.message);
    }
    res.status(500).send("Something went wrong, please try again");
}

server.use(ErrorHandler);

// Handling 404 requests
server.use((req, res) => {
    res.status(404).send("API not found. Visit localhost:3000/api-docs for more information.");
});


// Listening server
server.listen(port,()=>{
    console.log(`Server running on ${port}`);
    // connectToMongoDB();
    connectUsingMongoose();
});

// TODO
// Make Logger for Error messages