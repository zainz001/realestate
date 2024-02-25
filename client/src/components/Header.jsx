import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/about'
import Signin from '../pages/Signin'
import { useSelector } from 'react-redux'
export default function Header() {
  const { currentUser } = useSelector(state => state.user)
  const [ searchterm, setsearchterm]  = useState('');
  const navigate=useNavigate();
  const handlesearch=(e)=>{
    e.preventDefault();
    const urlParams=new URLSearchParams(window.location.search)
    urlParams.set('searchterm',searchterm);
    const searchquery=urlParams.toString();
    navigate(`/search?${searchquery}`)
  }
useEffect(()=>{
  const urlParams=new URLSearchParams(location.search)
  const searchTermfromurl=urlParams.get('searchterm')
  if(searchTermfromurl){
    setsearchterm(searchTermfromurl);
  }
},[location.search])

  return (

    <header className=' bg-slate-100 '>
      <div className='flex justify-between items-center  max-w-6xl  mx-auto p-3' >
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-lg flex flex-wrap' >

            <span className=' text-slate-900 ' > U </span>
            <span className=' text-slate-400' >Estate</span>
          </h1>
        </Link>
        <form onSubmit={handlesearch} className='flex  bg-slate-200 p-2 rounded-3xl items-center' >
          <input className=' focus:outline-none w-24 sm:w-64  bg-transparent' type="text" placeholder='Search...' 
          value={searchterm}
          onChange={(e)=> setsearchterm(e.target.value)} />
          <button>
          <FaSearch className=' text-slate-400 ' />
          </button>
        </form>
        <ul className='flex gap-4 ' >
          <Link to='/'>
            <li className=' hidden  sm:inline  text-slate-500 hover:underline '>Home</li>
          </Link>
          <Link to='/about'>
            <li className=' hidden  sm:inline  text-slate-500 hover:underline '>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img className=' w-7 h-7 rounded-full object-cover ' src={currentUser.avatar} alt="profile" />) : <li className=' sm:inline  text-slate-500 hover:underline '>Sign in</li>

            }   </Link>
        </ul>
      </div>
    </header>
  )
}
