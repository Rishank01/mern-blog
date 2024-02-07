import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.modal.js";

export const createComment = async ( req , res , next) => {
    try{
        const {content , postId , userId} = req.body;

        if(userId !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to create this comment'));
        }

        const newComment = new Comment({
            content , postId , userId
        });

        await newComment.save();

        res.status(200).json(newComment);
    }catch(error){
        next(error);
    }
}

export const getPostComments = async (req , res , next) => {
    try{
        const comments = await Comment.find({postId : req.params.postId}).sort({
            createdAt : -1,
        });
        res.status(200).json(comments);
    }catch(error){
        next(error);
    }
}

export const likeComment = async (req , res , next) => {
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404 , 'Comment not found'));
        }

        const userIndex = comment.likes.indexOf(req.user.id); // Finding if the users like in the likes array of the particular comment
        if(userIndex === -1){
            comment.likes.push(req.user.id);
            comment.numberOfLikes += 1;
        }
        else{
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex , 1); // This is for removing the user like from the likes array
        }

        await comment.save();
        res.status(200).json(comment);
        // const liked = comment.likes.include(req.user.id);
    }catch(error){
        next(error);
    }
}