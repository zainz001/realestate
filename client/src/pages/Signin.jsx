import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/userslice';
import { useSelector } from 'react-redux';
import Auth from '../components/auth';
import { useSpring, animated } from 'react-spring';

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  // Define fade-in animation
  const fadeAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 700 },
  });

  return (
    <div className='flex items-center justify-center bg-white  min-h-screen'>
      <animated.div style={fadeAnimation} className='p-8 bg-white shadow-lg rounded-md max-w-md w-full'>
        <h1 className='text-3xl font-semibold text-center mb-6'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type="text"
            onChange={handleChange}
            placeholder='Email'
            className='border py-2 px-4 rounded focus:outline-none focus:border-slate-700'
            id='email'
          />
          <input
            type='password'
            onChange={handleChange}
            placeholder='Password'
            className='border py-2 px-4 rounded focus:outline-none focus:border-slate-700'
            id='password'
          />
          <button
            disabled={loading}
            className='bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-50 py-2 px-4 rounded-full uppercase'
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <Auth />
        </form>

        <div className='flex items-center justify-between mt-5'>
          <p>Don't have an account?</p>
          <Link to={"/sign-up"}>
            <span className='text-blue-600'>Sign Up</span>
          </Link>
        </div>

        {error && <p className='text-red-500 mt-3 font-semibold'>{error}</p>}
      </animated.div>
    </div>
  );
}
