const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // console.log(authHeader)
        // BEARER <token>
        const token = authHeader.split(' ')[1];
        if (token) {
            // use the jwt.verify fdunction to check the token
            jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                if (err) {
                    res.status(401);
                    return res.json({
                        'error': 'Invalid or expired token'
                    })
                } else {
                    req.data = data;
                    return next();
                }
            })
        } else {
            res.status(401);
            return res.json({
                'error': 'Token not found'
            })
        }}
        else{
            res.status(400);
            return res.json({
                'error': 'Authenticate not found'
            })
        }
        
    } catch (error) {
        res.status(500)
        return res.json({ error: error.message })
    }
}
module.exports = {
    authenticateToken
}