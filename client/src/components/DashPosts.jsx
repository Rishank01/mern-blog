import { Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Button  } from 'flowbite-react';


export default function DashPosts() {
  const {currentUser} = useSelector((state) => state.user);
  const [userPosts , setUserPosts] = useState([]);
  const [showMore , setShowMore] = useState(true); // This is used to show the show button when the number of posts is more than 9 
  const [showModal , setShowModal] = useState(false); // This state is managed in order to show the delete pop up window every time the delete post button is clicked
  const [postIdToDelete , setPostIdToDelete] = useState('');


  // console.log(userPosts);
  // console.log(currentUser.isAdmin);

  useEffect(() => {
    const fetchPosts = async() => {
      try{
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json();
        // console.log(data);
        if(res.ok){
          setUserPosts(data.posts);
          if(data.posts.length < 9){
            setShowMore(true);
          }
        }
      }catch(error){
        console.log(error.message); 
      }
    };

    if(currentUser.isAdmin){
      fetchPosts();
    }
  },[currentUser._id]); // It will work each time the id will change


  const handleShowMore = async() => {
    const startIndex = userPosts.length;

    try{
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      
      if(res.ok){
        setUserPosts((prev) => [...prev , ...data.posts]);
        if(data.posts.length < 9){
          setShowMore(false);
        }
      }
    }catch(error){
      console.log(error);
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false);
    try{
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}` , {
        method : 'DELETE',
      });

      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    }catch(error){
      
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
      dark:scrollbar-thumb-slate-500' >
      {
        currentUser.isAdmin && userPosts.length > 0 ? (
          <div>
            <Table hoverable className='shadow-md'>

            {/* Header Section in the table */}
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>

              {/* Body Section in the table */}
              {
                userPosts.map((post , index) => (
                  <Table.Body className='divide-y' key = {index}>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <Link to = {`/post/${post.slug}`}>
                          <img src = {post.image} alt = {post.title} className='w-20 h-10 object-cover bg-gray-500'></img>
                        </Link>
                      </Table.Cell>
                      <Table.Cell className='font-medium text-gray-900 dark:text-white' to = {`/post/${post.slug}`}>{post.title}</Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span className='font-medium text-red-500 hover:underline cursor-pointer' 
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);

                        }}>Delete</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to = {`/update-post/$`} className='text-teal-500 hover:underline'>
                          <span>Edit</span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))
              }
            </Table>
            {showMore && (<button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>Show more</button>)}
          </div>
        ) : (
          <p>You have no posts yet!</p>
        )
      }

      {/* Modal for deleting a post */}
      <Modal show = {showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
              <div className="text-center">
                  <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                  <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3> 
                  <div className='flex justify-center gap-4'>
                      <Button color = 'failure' onClick={handleDeletePost}>Yes, I'm sure</Button>
                      <Button color = 'gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                  </div>
              </div>
          </Modal.Body>
      </Modal>
    </div>
  )
}
