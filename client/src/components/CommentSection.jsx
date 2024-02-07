import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect } from 'react'
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Comment from './Comment';

export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state) => state.user);

    const [comment , setComment] = useState('');
    const [commentError , setCommentError] = useState(null);

    // To showcase all the comments for a particular post below a specific post
    const [comments , setComments] = useState([]);

    console.log(comments);


    // function to handle the submit..
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(comment.length > 200){
            return;  
        }


        try{
            const res = await fetch(`/api/comment/create` , {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({content : comment , postId , userId : currentUser._id}),
            });
            const data = await res.json();
            if(res.ok){
                setComment('');
                setCommentError(null);
                setComments([data , ...comments]);
            }
        }catch(error){
            setCommentError(error.message);
        }

    };

     useEffect(() => {
        const getComments = async () => {
            try{
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if(res.ok){
                    const data = await res.json();
                    setComments(data);
                }   
            }catch(error){
                console.log(error);
            }
        }
        getComments();
     },[postId]);

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ? (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'> 
                <p>Signed in as:</p>
                <img src = {currentUser.profilePicture} alt = 'user Profile' className='h-5 w-5 rounded-full object-cover'/>
                <Link to = '/dashboard?tab=profile' className='text-xs text-cyan-600 hover:underline'>@{currentUser.username}</Link>
            </div>
        ) : (
            <div className='text-sm text-teal-500 my-5'>
                You must be signed in to comment.
                <Link to = {'/sign-in'} className='text-blue-500 hover:underline flex gap-1'>Sign In</Link>
            </div>
        )
      }

      {
        currentUser && (
            <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                <Textarea placeholder='Add a comment...' rows = '3' maxLength='200' onChange={(e) => setComment(e.target.value)} value={comment}/>
                <div className='flex justify-center items-center mt-5'>
                    <p className='text-gray-500 text-xs'>{200-comment.length} characters remaining</p>
                    <Button outline gradientDuoTone='purpleToBlue' type = 'submit'>Submit</Button>
                </div>

                {/* Alert popUp */}
                {commentError && (
                    <Alert color='failure' className='mt-5'>{commentError}</Alert>
                )}
            </form>
        )}
        {/* Comments for the particular post are displayed using this */}
      {
        comments.length === 0 ? (
            <p className='text-sm my-5'>No comments yet!</p>
        ) : (
            <div>
                <div className='text-sm my-5 flex items-center gap-1'>
                    <p>Comments</p>
                    <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                        <p>{comments.length}</p>
                    </div>
                </div>
                {
                    comments.map((comment) => (
                        <Comment key = {comment._id}
                            comment = {comment}/>
                    ))
                }

            </div>
        )  
      }
    </div>
  )
}
