import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footercom from './components/Footercom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';


const App = () => {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/about' element = {<About/>}/>

        <Route element = {<PrivateRoute/>}>
          <Route path = '/dashboard' element = {<Dashboard/>}/>
        </Route>

        <Route path = '/signin' element = {<SignIn/>}/>
        <Route path = '/signup' element = {<SignUp/>}/>
        <Route path = '/projects' element = {<Projects/>}/>
      </Routes>
      <Footercom/>
    </BrowserRouter>
  )
}

export default App
