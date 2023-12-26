
const AccessControlMiddleware = (req,res,next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5500'); // Use '*' for all origins
    res.header('Access-Control-Allow-Headers','*'); // Use '*' for all Headers
    res.header('Access-Control-Allow-Methods','*'); // Use '*' for all Methods
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
}

export default AccessControlMiddleware;