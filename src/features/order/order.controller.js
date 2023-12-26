import OrderRepository from "./order.repository";
import ApplicationError from "./application.error";

export default class OrderController {
    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req,res,next) {
        try {
            const userId = req.userId;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("Order is placed successfully");
        } catch (error) {
            throw new ApplicationError("Something went wrong",500); 
        }
    }
}