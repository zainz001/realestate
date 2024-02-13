import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import Auth from '../components/auth';

export default function Signout() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const res = await fetch('/server/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  // Define fade-in animation
  const fadeAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 500 },
  });

  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <animated.div style={fadeAnimation} className='p-8 bg-white shadow-lg rounded-md max-w-md w-full'>
        <h1 className='text-3xl font-semibold text-center mb-6'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            onChange={handleChange}
            type="text"
            placeholder='Username'
            className='border py-2 px-4 rounded focus:outline-none'
            id='username'
          />
          <input
            type="text"
            onChange={handleChange}
            placeholder='Email'
            className='border py-2 px-4 rounded focus:outline-none'
            id='email'
          />
          <input
            onChange={handleChange}
            type="password"
            placeholder='Password'
            className='border py-2 px-4 rounded focus:outline-none'
            id='password'
          />
          <button
            disabled={loading}
            className='bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-50 py-2 px-4 rounded-full uppercase'
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <Auth />
        </form>

        <div className='flex justify-center items-center mt-5'>
          <p className='mr-2'>Already have an account?</p>
          <Link to='/sign-in'>
            <span className='text-blue-600'>Sign In</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-3'>{error}</p>}
      </animated.div>
    </div>
  );
}
