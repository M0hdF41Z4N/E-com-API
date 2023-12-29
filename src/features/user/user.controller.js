import  UserModel  from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";


export default class UserController {
    constructor () {
        this.userRepository = new UserRepository();
    }

    async resetPassword(req,res) { 
        try {
            const newPassword = req.body;
            const hashPassword = bcrypt(newPassword,12);
            const userID = req.userID;
            await this.userRepository.resetPassword(userID, hashPassword);
            res.status(201).send("Password has been reset successfully");
        } catch (error) {
            console.log('error :', error);
            res.status(500).send("Unable to reset password. Please try again");
        }
    }

    async signUp (req,res) {
        try {
            // Getting user information
            const {name,email,password,type} = req.body;
            // Creating hashed password
            const hashPassword = await bcrypt.hash(password,12);
            // Creating user
            const newUser = new UserModel(name,email,hashPassword,type);
            // storing user into database
            await this.userRepository.signUp(newUser);
            // sending response
            res.status(201).send("User created successfully");
        } catch (error) {
            res.status(500).send("Unable to create user");
            // throw new ApplicationError("Something went wrong",500);
        }

    }
    async signIn (req,res) {
        try {
            // const secretKey = "EyesNeverLies";
            const secretKey = process.env.JWT_SECRET;
            // Getting email and password
            const {email,password} = req.body;
            // Getting user by email
            const user = await this.userRepository.findByEmail(email);
            // Case 0 : user is does not exist
            if (!user) { 
                return res.status(400).send("Incorrect username or password");
            }
            // Case 1 : user is exists
            else{ 
                // compare password
                const matched = await bcrypt.compare(password,user.password);
                // when password matched
                if (matched) {
                    // Creating Token
                    const Token = jwt.sign({userID:user._id
                    ,email: user.email},secretKey,{
                        expiresIn:'1h',
                    })
                    // Sending Token
                    return res.status(200).send(Token);
                }
                // when password does not match
                else { 
                    return res.status(400).send("Incorrect username or password");
                }
            }
            // const user = await this.userRepository.signIn(email,password);
        }catch (e) { 
            console.log(e);
            return res.status(401).send("Unauthorized");
        }
    }
}