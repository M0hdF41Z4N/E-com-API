export default class CartItemModel{
    constructor(productID,userID,quantity,id) {
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
        this.id = id;
    }

    static add(productID,userID,quantity) { 
        const Item = new CartItemModel(productID,userID,quantity);
        Item.id = cartItems.length + 1;
        cartItems.push(Item);
        return Item;
    }

    static delete(cartItemID,userID) {
        // Getting Item from Cart
        const Item = cartItems.find(item => item.userID == userID && item.id == cartItemID);
        if (!Item) { 
            return "Item not found";
        }else {
            // Removing Item and Updating Cart 
            cartItems = cartItems.filter(item =>item.userID == userID && item.id != cartItemID);
            // return Item;
        }
    }

    static getAll(userID) {
        return cartItems.filter(item => item.userID == userID && item.userID == userID)
    }
}

var cartItems = [
    new CartItemModel(1,2,1,1),
    new CartItemModel(1,1,2,2)
];
