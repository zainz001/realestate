import React from 'react'
import { Link } from 'react-router-dom'

export default function Signout() {
  return (
    <div className=' p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl text-center  font-semibold  my-6' >Sign up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' className=' border p-3 rounded-lg ' id='username' />

        <input type="text" placeholder='Email' className=' border p-3 rounded-lg ' id='email' />

        <input type="text" placeholder='Password' className=' border p-3 rounded-lg ' id='password' />
        <button className=' bg-slate-700  text-white hover:opacity-80 disabled:opacity-10 p-3 rounded-2xl uppercase ' >sign up</button>
      </form>
      <div className='flex gap-2  mt-5'><p>Already have an account?</p>
      <Link to={"/sign-in"}>
        <span className=' text-blue-600' >Sign in</span>
      </Link>
        </div>
    </div>
  )
}
