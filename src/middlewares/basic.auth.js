import UserModel from "../features/user/user.model.js";


const authorizer = (req, res, next) => { 
    const authHeader = req.headers["authorization"];
    // Case 1 : if authorization header is empty
    if (!authHeader) {
        return res.status(401).send("No authorization details found");
    }
    // Extract Creds
    const base64Creds = authHeader.replace('Basic ','');
    // Decode Creds
    const decodedCreds = Buffer.from(base64Creds,'base64').toString('utf-8');
    const creds = decodedCreds.split(':');
    const user = UserModel.getAll().find(user => user.email == creds[0] 
        && user.password == creds[1] );
    if (user) {
        next();
    }else {
        res.status(401).send("Invalid credentials");
    }
}

export default authorizer;
