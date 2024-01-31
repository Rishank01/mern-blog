import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateFailure, updateStart, updateSuccess , signoutSuccess } from '../redux/user/userSlice';


import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function DashProfile() {


    const dispatch = useDispatch();

    const {currentUser , error} = useSelector((state) => state.user);
    const [imageFile , setImageFile] = useState(null);
    const [imageFileUrl , setImageFileUrl] = useState(null);
    const [imageFileUploadProgress , setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError , setImageFileUploadError] = useState(null);

    // This state is managed in order to check if the image file is completely uploaded or not.....Before we make the update request..
    const [imageFileUploading , setImageFileUploading] = useState(false);

    // TO manage the state that the profile is updated
    const [updateUserSuccess , setUpdateUserSuccess] = useState(null);

    // To manage the state that there is nothing to update
    const [updateUserError, setUpdateUserError] = useState(null);


    // Creation of a formData state , which helps to track data in updation through update api functionality.....
    const [formData , setFormData] = useState({});

    // This state is managed in order to know when the delete user popup window must be visible and when not.
    const [showModal , setShowModal] = useState(false);

    console.log(imageFileUploadProgress , imageFileUploadError);

    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file)); // This will create the TEMPORARY image file url from the image file name uploaded on the site.
        }
        
    };

    
    useEffect(() => {
        if(imageFile){
            uploadImage();
        } 
    } , [imageFile]);

    const uploadImage = async () => {
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write:if
        //         request.resource.size < 2 * 1024 * 1024 && 
        //         request.resource.contentType.matches('image/.*');
                
        //       }
        //    }
        // }
        
        // At the  start of the image upload set the error to null
        setImageFileUploading(true);
        setImageFileUploadError(null);

        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name; // To make the filename always unique
        const storageRef = ref(storage , fileName);
        const uploadTask = uploadBytesResumable(storageRef , imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0)); // To round of the progress of file uploading Progress we used toFixed(0)
            },
            (error) => {
                setImageFileUploadError('Could not upload Image');
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData , profilePicture : downloadURL});
                    setImageFileUploading(false);
                });
            }
        );
        // console.log("uploading Image...")
    };


    // handleChange function to manage the changes in the formData...
    const handleChange = (e) => {
        setFormData({...formData , [e.target.id] : e.target.value});
    };
    // console.log(formData);


    // Submitting the updated formData 
    const handleSubmit = async (e) => {
        setUpdateUserError(null);
        setUpdateUserSuccess(null); 
        e.preventDefault();
        if(Object.keys(formData).length === 0){ // This is to check if the updated form data is empty or not...
            setUpdateUserError('No changes made');
            return;
        }

        if(imageFileUploading){
            setUpdateUserError('Please wait for the image to upload');  
            return;
        }

        try{
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(formData),
            })   
            const data = await res.json();

            if(!res.ok){
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            }
            else{
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated Successfully");
            }
        }
        catch(error){
            dispatch(updateFailure(error.message));
            setUpdateUserError(data.message);
        }
    }

    const handleDeleteUser = async() => {
        setShowModal(false);
        try{
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}` , {method : 'DELETE' , } );
            const data = await res.json();
            
            if(!res.ok){
                dispatch(deleteUserFailure(data.message));
            }
            else{
                dispatch(deleteUserSuccess(data));
            }
        }
        catch(error){
            dispatch(deleteUserFailure(error.message));
        }
    };

    // To handle the signout functionality
    const handleSignOut = async() => {
        try{
            const res = await fetch('/api/user/signout' , {
                method : 'POST',
            });
            const data = res.json();
            
            if(!res.ok){
                console.log(error.message);
            }
            else{
                dispatch(signoutSuccess());
            }
        }
        catch(error){
            console.log(error.message);
        }
    }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit = {handleSubmit} className='flex flex-col gap-4'>

        {/* Upload Image and also hiding the choose file option from the web page */}
        <input type = 'file' accept = 'image/*' onChange={handleImageChange} ref = {filePickerRef} hidden/> 

        {/* On Clicking on this div the file picker reference will be called i.e. the choose file option */}
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}> 

            {imageFileUploadProgress && (<CircularProgressbar value = {imageFileUploadProgress || 0} text = {`${imageFileUploadProgress}%`} 
            strokeWidth = {5} 
            styles = {{
                root : {
                    width : '100%',
                    height : '100%',
                    position : 'absolute',
                    top : 0,
                    left : 0,
                },
                path : {
                    stroke : `rgba(62 , 152 , 199 , ${imageFileUploadProgress / 100})`,
                },
            }}
            /> 
            )}
                <img src = {imageFileUrl || currentUser.profilePicture} alt = "user" 
                className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover
                            ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
        </div>

        {/* Rendering the Alert here in case there is any error while uploading the file toh the firebase */}
        
        {imageFileUploadError && <Alert color = 'failure'>
            {imageFileUploadError}  {/* We want to show this error message in the alert */}
        </Alert>} 

        <TextInput type = 'text' id = 'username' placeholder='username' defaultValue = {currentUser.username} onChange={handleChange}/>
        <TextInput type = 'email' id = 'email' placeholder='email' defaultValue = {currentUser.email} onChange={handleChange}/>
        <TextInput type = 'password' id = 'password' placeholder='password' onChange={handleChange}/>

        <Button type = 'submit' gradientDuoTone='purpleToBlue' outline >Update</Button>
      </form>
      
      <div className='text-red-500 flex justify-between'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
      </div>

      {/* Alert message to display that the user is updated successfully*/}
      {updateUserSuccess && 
    (<Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>)}

    {updateUserError &&   
    (<Alert color='failure' className='mt-5'>{updateUserError}</Alert>)}
    
    {error &&   
    (<Alert color='failure' className='mt-5'>{error}</Alert>)}
        
    <Modal show = {showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3> 
                    <div className='flex justify-center gap-4'>
                        <Button color = 'failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                        <Button color = 'gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </div>
            </Modal.Body>
    </Modal>
    </div>
  );
}
