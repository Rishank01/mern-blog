import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async(req , res , next) => {
    // console.log(req.user);
    if(!req.user.isAdmin){ // As the isAdmin will be stored in the cookie not in the body sent by the user
        return next(errorHandler(403 , 'You are not allowed to create a post'));
    }

    if(!req.body.content || !req.body.title){
        return next(errorHandler(400 , 'Please provide all required fields'));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g,'-');

    const newPost = new Post({
        ...req.body , slug , userId : req.user.id
    });

    console.log(newPost);
    try{
        // console.log("Hi");
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    }catch(error){
        next(error);
    }
}