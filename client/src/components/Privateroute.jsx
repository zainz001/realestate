import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


export default function Privateroute() {
  const {currentUser}=useSelector((state)=>state.user)//in this if user is not login it will send to the signin page if he/she login then show profile
    return (
    currentUser?<Outlet/>:<Navigate to='/sign-in'/>
  )
}
