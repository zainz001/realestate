import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userslice';

const Auth = () => {
  const dispatch = useDispatch(); // Move the hook call here

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/server/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      
      
      
      const data = await res.json();
      dispatch(signInSuccess(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className='bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-95'
      type='button'
    >
      continue with google
    </button>
  );
};

export default Auth;
