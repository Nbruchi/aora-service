const jwt = require("jsonwebtoken");
const User = require('../models/UserModel');

const authMiddleware = async (req,res,next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];

        try {
            if (token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                next()
            }
        }catch(err){
            res.status(401);
            throw new Error('Invalid token');
        }
    }else{
        res.status(401);
        throw new Error('No token, authorization denied');
    }
}

module.exports = authMiddleware;