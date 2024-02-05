import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";

export const test = (req , res) => {
    res.json({
        message : "API Working Properly",
    })
}


export const updateUser = async (req , res , next) => {
    // Validation check for the user id

    // console.log("Entered the UpdateUser file");

    if(req.user.id !== req.params.userId){
        return next(errorHandler(403 , 'You are not allowed to update this user'));
    }

    // Checks for the password
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400 , 'Password must be atleast 6 characters'));
        }

        // console.log("Before Hashing the password");
        req.body.password = bcryptjs.hashSync(req.body.password , 10);
    }
    // console.log("Printing the request.user ",req.user);



    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400 , 'Username must be between 7 and 20 <characters></characters>'));
        }
        if(req.body.username.includes(" ")){
            return next(errorHandler(400 , 'Username cannot contain spaces'));
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400 , 'Username must be lower Case'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){ // Do not provide space between and after '+' in the REGEX otherwise it will trigger an error...
            return next(errorHandler(400 , 'Username can only contains letters and numbers'));
        }
    }

        // console.log("In update user");
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.userId , {
            $set : {
                username : req.body.username,
                email : req.body.email,
                profilePicture : req.body.profilePicture,
                password : req.body.password,
            },
        }, {new : true} );
        const {password , ...rest} = updatedUser._doc;
        // console.log("Now I am going to print the value of the updated user");
        // console.log("The value of the updated user is ",updateUser);
        // console.log("This is the value in the rest " , rest);
        return res.status(200).json(rest);
    }
    catch(error){
        next(error);    
    }
}


export const deleteUser = async (req , res , next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(403 , 'You are not allowed to delete this user'));
    }

    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({
            message : 'User has been deleted',
        });
    }catch(error){
        next(error);
    }
}


export const signout = (req , res , next) => {
    try{
        res.clearCookie('access_token').status(200).json('User has been signed out'); 
    }
    catch(error){
        next(error);
    }
};


export const getUsers =  async (req , res , next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403 , "You arr not allowed to see all users"));
    }
    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find().sort({createdAt : sortDirection}).skip(startIndex).limit(limit); 

        const usersWithoutPassword = users.map((user) => {
            const {password , ...rest } = user._doc;            // Seperate all the users without password , So that we can access the users but not there passwords
            return rest;
        })

        const totalUsers = await User.countDocuments();
        // Last months users
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),      
            now.getMonth()-1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt : { $gte : oneMonthAgo }, // greater than one month ago
        });

        res.status(200).json({
            users : usersWithoutPassword,
            totalUsers , 
            lastMonthUsers
        });

    }catch(error){
        next(error);
    }
}