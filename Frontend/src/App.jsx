import React, { useState } from 'react'
import { createContext } from 'react'
import { LoginContext } from './context/LoginContext'
import Navbar from './components/Navbar'
import {Routes,Route, Navigate} from 'react-router-dom'

import Home from './pages/Home'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import CreatePost from './pages/CreatePost'
import Modal from './components/Modal'
import UserProfile from './components/UserProfile'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

import Myfollowingpost from './pages/Myfollowingpost'


const App = () => {

  const [userLogin, setuserLogin] = useState(false);
  const [modalOpen, setmodalOpen] = useState(false);


  return (
     <> 
       <LoginContext.Provider value={{setuserLogin,setmodalOpen}}>

        <Navbar login={userLogin} />

        <Routes>
          <Route path='/' element={userLogin ? <Home/> : <Navigate to="/Signin" />}> </Route>
          <Route path='/Signup' element={<Signup/>}> </Route>
          <Route path='/Signin' element={<Signin/>}> </Route>
          <Route exect path='/Profile' element={<Profile/>}> </Route>
          <Route path='/CreatePost' element={<CreatePost/>}> </Route>
          <Route path='/profile/:userid' element={<UserProfile/>}> </Route>
          <Route path='/followingpost' element={<Myfollowingpost/>}> </Route>
        </Routes>
        <ToastContainer theme='dark'/>
        {modalOpen && <Modal />}
     </LoginContext.Provider>
    </>
   
  )
}

export default App

