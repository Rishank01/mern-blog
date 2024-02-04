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


export const getposts = async(req , res , next) => {
    try{
        const startIndex = parseInt(req.query.startIndex) || 0; // If any start index is given then start fetching from that index ... otherwise from 0.
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        // Now searching the posts
        const posts = await Post.find({
            ...(req.query.userId && {userId : req.query.userId}),
            ...(req.query.category && {category : req.query.category}),
            ...(req.query.slug && {slug : req.query.slug}),
            ...(req.query.postId && {_id : req.query.postId}),
            ...(req.query.searchTerm && {
                // or is used to give the choice ... either search in one or the other
                $or : [ 
                    { title : {$regex : req.query.searchTerm , $options : 'i'}}, // Here i in options is used so as to search case insensitively..
                    { content : {$regex : req.query.searchTerm , $options : 'i'}}, // regex is the function to search a pattern
                ],
            }),}).sort({ updatedAt : sortDirection }).skip(startIndex).limit(limit);

            // Fetching the total number of posts...
            const totalPosts = await Post.countDocuments();

            // Fetching the total number of posts of the last month
            const now = new Date();
            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth()-1,
                now.getDate()
            );

            const lastMonthPosts = await Post.countDocuments({
                createdAt : {$gte : oneMonthAgo},
            })

            res.status(200).json({
                posts,
                totalPosts,
                lastMonthPosts,
            })

    }catch(error){
        next(error);
    }
}


export const deletepost = async(req , res , next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403 , 'You are not allowed to delete this post'));
    }

    try{
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted');
    }catch(error){
        next(error.message);
    }
}