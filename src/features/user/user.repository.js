import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import {userSchema} from "./user.schema";

const UserModel = mongoose.model('User',userSchema);

class UserRepository {

    async resetPassword(userID,hashPassword) { 
        try {
            let user = await UserModel.findById(userID);
            if (!user) { 
                throw new ApplicationError("User not found",404);
            }
            user.password = hashPassword;
            user.save();
        } catch (error) {
            throw new ApplicationError(error,500);
        }
    }
     
    async signUp(newUser){
        try {

            // connecting to DB
            const db = getDB();
            // Getting collection
            const users = await db.collection('users');

            // insert the document into the collection
            await users.insertOne(newUser);
            return newUser;
        } catch (e) { 
            throw new ApplicationError("Something went wrong",500);
        }
    }
     
    async signIn(email,password){
        try {
            // connecting to DB
            const db = await getDB();
            // Getting collection
            const users = await db.collection('users');

            // finding user
            let user = await users.findOne({email, password});
            if (!user) { 
                throw new ApplicationError("Unauthorized",401);
            }else {
                return user;
            }
        } catch (e) { 
            throw new ApplicationError("Something went wrong",500);
        }
    }

    async findByEmail(email){
        try {
            // connecting to DB
            const db = await getDB();
            // Getting collection
            const users = await db.collection('users');
            const user = await users.findOne({ email: email });
            if (user) { 
                return user;
            }
            else {
                throw new ApplicationError("Unauthorized",401);
            }
        } catch (error) {
            throw new ApplicationError("Something went wrong",500);
        }
    }
}

export default UserRepository;