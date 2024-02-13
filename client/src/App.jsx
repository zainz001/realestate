import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/about';
import Profile from './pages/profile';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Header from './components/Header';
import Privateroute from './components/Privateroute';
import Listing from './pages/listing';
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}  />
      
      <Route path="/sign-up" element={<Signup/>}  />
      <Route path="/sign-in" element={<Signin/>}  />
      <Route path="/about" element={<About/>}  />
      <Route  element={<Privateroute/>} > 
      <Route path="/profile" element={<Profile/>}  />
      <Route path="/create-listing" element={<Listing/>}  />
      
      </Route>

    </Routes>
    
    </BrowserRouter>
  )
}
