import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { app } from '../firebase';


// We have just altered the create post page in this part

export default function UpdatePost() {

    const [file , setFile] = useState(null);
    const [imageUploadProgress , setImageUploadProgress] = useState(null);
    const [imageUploadError , setImageUploadError] = useState(null);
    const [publishError , setPublishError] = useState(null);
    const [formData , setFormData] = useState({})
    const {postId} = useParams();

    const {currentUser} = useSelector((state) => state.user);

    // console.log("I am in update post");
    // console.log(formData);


    // We will make a fetch request call every time the post Id is changed
    useEffect(() => {

        try{
            const fetchPosts = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();

                if(!res.ok){
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if(res.ok){
                    setPublishError(null);
                    setFormData(data.posts[0]);
                }
            }
            fetchPosts();
        }catch(error){
            console.log(error.message);
        }
    } , [postId]);

    const navigate = useNavigate(); 
    // console.log(formData); 

    const handleUploadImage = async() => {
        try{    
            if(!file){
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name; 
            const storageRef = ref(storage , fileName);
            const uploadTask = uploadBytesResumable(storageRef , file);

            uploadTask.on(
                'state_changed' , 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0)); // toFixed to take only the integer part...
                },
                (error) => {
                    setImageUploadError('Image upload Failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadError(null);
                        setImageUploadProgress(null);
                        setFormData({...formData , image : downloadURL});
                    });
                }
            );

        }catch(error){
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            // console.log("In handle submit");
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}` , {
                method : 'PUT' ,
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(formData),
             })

            const data = await res.json();
            // console.log("Json --> ",data);

            if(!res.ok){
                setPublishError(data.message);
                return;
            }
            if(res.ok){
                setPublishError(null);
                navigate(`/post/${data.slug}`);  // Creating the dynamic and the unique url for each post that is being created by the admin..
            }
        }catch(error){
            setPublishError(error.message);
        }
    }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen '>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type = 'text' placeholder='Title' required id = 'title' className='flex-1'
                    onChange={(e) => {setFormData({...formData , title : e.target.value})}} value={formData.title}
                />

                <Select
                onChange={(e) => {setFormData({...formData , category : e.target.value})}} value = {formData.category}>
                    <option value = 'uncategorized'>Select a category</option> {/* If someone chooses this , it means that no option is chosen */}
                    <option value = 'javascript'>JavaScript</option>
                    <option value = 'reactjs'>React.js</option>
                    <option value = 'nextjs'>Next.js</option> 
                </Select>

            </div>
            <div className='flex gap-4 items-center justify-between border-spacing-4 border-teal-500 border-4 border-dotted p-3 '>
                <FileInput type = 'file' accept = 'image/*' onChange={(e) => setFile(e.target.files[0])}/>
                <Button type = 'button' gradientDuoTone = 'purpleToBlue' size = 'sm' outline onClick={handleUploadImage} disabled = {imageUploadProgress}>
                    {
                        imageUploadProgress ? ( 
                        <div className='w-16 h-16'>
                            <CircularProgressbar value = {imageUploadProgress} text = {`${imageUploadProgress || 0}%`} />
                        </div> ) : 
                        ('Upload Image') 
                    }    
                </Button>
            </div>

            {/* Displaying the alert if there is any error while uploading the image */}
            {imageUploadError && ( 
                <Alert color = 'failure'>{imageUploadError}</Alert>
            )}

            {formData.image && (
                <img src={formData.image} alt = 'upload' className='w-full h-72 object-cover'/>
            )}


            {/* This is used in order to provide an interface where we can write anything as per our need (blog) content 
                Its CSS is provided in the index.css */}
            <ReactQuill theme = "snow" placeholder='Write Something....' className='h-72 mb-12' required  value = {formData.content}
            onChange={(value) => {setFormData({...formData , content : value})}} /> {/* This is how we do access the value in the quilt */}

            <Button type='submit' gradientDuoTone='purpleToPink'>Update Post</Button> 

            {
                publishError && <Alert color = 'failure' className='mt-5'>{publishError}</Alert> 
            }
        </form>
    </div>
  )
}
