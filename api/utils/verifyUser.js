import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req , res , next) => {

    // console.log("I am in verifyToken.js");
    const token = req.cookies.access_token;

    // console.log("The value of token in the verifyToken file ",token);

    if(!token){
        return next(errorHandler(401 , 'Unauthorized'));
    }
    jwt.verify(token , process.env.JWT_SECRET , (err , user) => {
        if(err){
            return next(errorHandler(401 , 'Unauthorized'));
        }
        // If the user is the authorized user then we would the user data along with the request....
        req.user = user;
        next(); 
    });
    // console.log("Leaving the verifyToken file");
};
