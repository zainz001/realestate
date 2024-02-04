import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { signInStart,signInFailure,signInSuccess } from '../redux/userslice';
import { useSelector } from 'react-redux';
import Auth from '../components/auth';
export default function Signin() {
  const [formData, setFormData] = useState({});
 const {loading,error} = useSelector((state)=>state.user)
 // State to toggle password visibility
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      dispatch(signInStart());
      const res = await fetch('/server/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Data from server:', data);

      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return;
      }

      dispatch(signInSuccess(data))
      navigate('/');

    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-6'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="text"
          onChange={handleChange}
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
        />
          <input
          type='password'
            onChange={handleChange}
            placeholder='Password'
            className='border p-3 rounded-lg pr-10' // Adjusted for icon space
            id='password'
          />
          
        
        <button
          disabled={loading}
          className='bg-slate-700 text-white hover:opacity-80 disabled:opacity-10 p-3 rounded-2xl uppercase'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <Auth/>
      </form>
      
      <div className='flex gap-2 mt-5'>
        <p>Create account</p>
        <Link to={"/sign-out"}>
          <span className='text-blue-600'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-3 font-semibold'>{error}</p>}
    </div>
  );
}
