import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import { errorHandler } from '../utils/error.js';

dotenv.config();

export const signup = async(req , res , next) => {
    const {username , email , password} = req.body; 

    if(!username || !email || !password || username === '' || email === '' || password === ''){ 
        next(errorHandler(400 , 'All fields are required')); 
    }

    const hashedPassword = bcryptjs.hashSync(password , 10);

    const newUser = new User({
        username , email , password : hashedPassword 
    });

    try{
        await newUser.save();

        res.json({
            message : "Signup Successfull",
        })
    }
    catch(error){
        next(error);
    }
    
}


export const signin = async(req , res , next) => {
        const {email , password} = req.body; 
    
        if(!email || !password || email === '' || password === ''){ 
            next(errorHandler(400 , 'All fields are required')); 
        }
    
        try{
            const validUser = await User.findOne({email});
            if(!validUser){
                return next(errorHandler(400 , 'User Not Found')); 
            }
    
            const validPassword = bcryptjs.compareSync(password , validUser.password);
            if(!validPassword){
                return next(errorHandler(400 , 'Invalid Password'));
            }

            const token = jwt.sign(
                { id : validUser._id } , process.env.JWT_SECRET  
            );

            // This will seperate the password and the rest
            const {password : pass,...rest} = validUser._doc;

            res.status(200).cookie('access_token' , token , {httpOnly : true }).json({
                message : "Signin Successfull",
                data : rest,
            })
        }
        catch(error){
            next(error);
        }
    
}

