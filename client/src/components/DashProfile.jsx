import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { app } from '../firebase';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function DashProfile() {

    const {currentUser} = useSelector((state) => state.user);
    const [imageFile , setImageFile] = useState(null);
    const [imageFileUrl , setImageFileUrl] = useState(null);
    const [imageFileUploadProgress , setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError , setImageFileUploadError] = useState(null);

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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                });
            }
        );
        // console.log("uploading Image...")
    };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>

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

        <TextInput type = 'text' id = 'username' placeholder='username' defaultValue = {currentUser.username} />
        <TextInput type = 'email' id = 'email' placeholder='email' defaultValue = {currentUser.email} />
        <TextInput type = 'password' id = 'password' placeholder='password' />

        <Button type = 'submit' gradientDuoTone='purpleToBlue' outline >Update</Button>
      </form>
      
      <div className='text-red-500 flex justify-between'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
