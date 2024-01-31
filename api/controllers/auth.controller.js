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
                // Also passing the isAdmin functionality
                { id : validUser._id  , isAdmin : validUser.isAdmin } , process.env.JWT_SECRET  
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


export const google = async (req , res , next) => {
    const {email , name , googlePhotoUrl} = req.body;

    try{
        const user = await User.findOne({email});
        if(user){
            // Also passing the isAdmin functionality
            const token = jwt.sign({id : user._id , isAdmin : user.isAdmin} , process.env.JWT_SECRET);
            const { password , ...rest } = user._doc;
            res.status(200).cookie('access_token' , token , {
                httpOnly : true,
            }).json(rest); 
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // toString(36)--> this 36 means alphabets and numbers.
            const hashedPassword = bcryptjs.hashSync(generatedPassword , 10);
            const newUser = new User({
                username : name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email , 
                password : hashedPassword,
                profilePicture : googlePhotoUrl,
            });
            await newUser.save();
            // Also passing the isAdmin functionality
            const token = jwt.sign({id : newUser._id , isAdmin : newUser.isAdmin} , process.env.JWT_SECRET);
            const { password , ...rest } = newUser._doc;
            res.status(200).cookie('access_token' , token , {
                httpOnly : true,    
            }).json(rest);
        }
    }
    catch(error){
        next(error);
    }
}
