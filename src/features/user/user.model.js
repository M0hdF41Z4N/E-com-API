import { ApplicationError } from "../../error-handler/applicationError.js";


export default class UserModel{
    constructor(name,email,password,type,id){
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this._id = id;
    }

     async signUp(name,email,password,type){
        try {
            const newUser = new UserModel(
                name,email,password,type,
            );
            return newUser;
        } catch (e) { 
            throw new ApplicationError("Something went wrong",500);
        }
    }

    getAll() {
        return users;
    }
}


let users = [{
    id:777,
    name: "John",
    email: "john@example.com",
    password: "test123",
    type : "seller",
}]