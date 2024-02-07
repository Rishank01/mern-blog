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
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/updatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';


const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/about' element = {<About/>}/>

        <Route element = {<PrivateRoute/>}>
          <Route path = '/dashboard' element = {<Dashboard/>}/>
        </Route>

        <Route element = {<OnlyAdminPrivateRoute/>}>
          <Route path = '/create-post' element = {<CreatePost/>}/>
          <Route path = '/update-post/:postId' element = {<UpdatePost/>}/>
        </Route>

        <Route path = '/signin' element = {<SignIn/>}/>
        <Route path = '/signup' element = {<SignUp/>}/>
        <Route path = '/projects' element = {<Projects/>}/>
        <Route path = '/post/:postSlug' element = {<PostPage/>}/>
      </Routes>
      <Footercom/>
    </BrowserRouter>
  )
}

export default App
