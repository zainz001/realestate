import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userslice';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const dispatch = useDispatch(); // Move the hook call here
  const navigate = useNavigate();
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
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className='bg-red-600 text-white p-3 rounded-full uppercase hover:opacity-95'
      type='button'
    >
      continue with google
    </button>
  );
};

export default Auth;
