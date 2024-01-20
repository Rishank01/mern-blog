import React from 'react';
import Route, { BrowserRouter, Routes } from 'react-router-dom';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/about' element = {<About/>}/>
        <Route path = '/dashboard' element = {<Dashboard/>}/>
        <Route path = '/signin' element = {<SignIn/>}/>
        <Route path = '/signup' element = {<SignUp/>}/>
        <Route path = '/projects' element = {<Projects/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
