import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Auth from '../components/auth';

export default function Signout() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch('/server/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      console.log('Data from server:', data);
  
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        console.log('Error message:', data.message);
        return;
      } 
  
      setLoading(false);
      setError(null);
      navigate('/sign-in');
  
    } catch (error) {
      setLoading(false);
      console.error('Error during submission:', error);
      setError(error.message);
    }
  }
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-6'>Sign up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={handleChange} type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' />
        <input type="text" onChange={handleChange} placeholder='Email' className='border p-3 rounded-lg' id='email' />
        <input onChange={handleChange} type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white hover:opacity-80 disabled:opacity-10 p-3 rounded-2xl uppercase'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <Auth/>
      </form>
      
      <div className='flex gap-2 mt-5'>
        <p>Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-600'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-3'>{error}</p>}

    </div>
  );
}
