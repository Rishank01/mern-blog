import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { Button } from 'flowbite-react';
import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice';
// Enable the authentication from the firebase for the project 


export default function OAuth() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

    const auth = getAuth(app); // This app is coming from the firebase.

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'});

        try{
            const resultsFromGoogle = await signInWithPopup(auth , provider);
            // console.log(resultsFromGoogle); 
            const res = await fetch('api/auth/google' , {
              method : 'POST',
              headers : { 'Content-Type' : 'application/json'},
              body : JSON.stringify({
                name : resultsFromGoogle.user.displayName,
                email : resultsFromGoogle.user.email,
                googlePhotoUrl : resultsFromGoogle.user.photoURL,
              }),
            });
            const data = await res.json();
            // console.log("Data from the server" , data);

            if(res.ok){
              dispatch(signInSuccess(data));
              navigate('/');
            }
        }
        catch(error){
            console.log("Error",error);
        }
    }

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
      Continue with Google
    </Button>
  )
}
