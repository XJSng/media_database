const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // BEARER <token>
        const token = authHeader.split(' ')[1];
        if (token) {
            console.log(process.env.JWT_SECRET)
            // use the jwt.verify fdunction to check the token
            jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
                if (err) {
                    res.status(401);
                    return res.json({
                        'error': 'Invalid or expired token'
                    })
                } else {
                    console.log("success route hit")
                    req.data = data;
                    console.log("req.data=>", req.data)
                    next();
                }
            })
        } else {
            res.status(401);
            return res.json({
                'error': 'Token not found'
            })
        }
    }
}
module.exports = {
    authenticateToken
}