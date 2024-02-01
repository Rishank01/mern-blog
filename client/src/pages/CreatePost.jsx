import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen '>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create Post</h1>
        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type = 'text' placeholder='Title' required id = 'title' className='flex-1' />
                <Select>
                    <option value = 'uncategorized'>Select a category</option> {/* If someone chooses this , it means that no option is chosen */}
                    <option value = 'javascript'>JavaScript</option>
                    <option value = 'reactjs'>React.js</option>
                    <option value = 'nextjs'>Next.js</option> 
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-spacing-4 border-teal-500 border-4 border-dotted p-3 '>
                <FileInput type = 'file' accept = 'image/*' />
                <Button type = 'button' gradientDuoTone = 'purpleToBlue' size = 'sm' outline>Upload Image</Button>
            </div>


            {/* This is used in order to provide an interface where we can write anything as per our need (blog) content 
                Its CSS is provided in the index.css */}
            <ReactQuill theme = "snow" placeholder='Write Something....' className='h-72 mb-12' required/>

            <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button> 
        </form>
    </div>
  )
}
