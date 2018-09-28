const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }catch(e){
        return res.status(401).json({
            status: "Error",
            response_code: 401,
            message: "Unauthorized request"
        });
    }
}
module.exports = checkAuth;