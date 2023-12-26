import jwt from 'jsonwebtoken';
// const secretKey = "EyesNeverLies";
const secretKey = process.env.JWT_SECRET;

const jwtAuth = (req, res, next) => {
    // Reading the token from the request
    const token = req.headers['authorization'];
    // Case 0 : No Token Found
    if (!token) { 
        return res.status(401).send("Unauthorized");
    }
    // Validating the token
    try{
        // Case 1 : Token is Valid
        const payload = jwt.verify(token, secretKey);
        req.userID = payload.userID;
    }
    // Case 2 : Token is Invalid
    catch (err) {

        // return error
        return res.status(401).send("Unauthorized");
    }
    next();
}

export default jwtAuth;