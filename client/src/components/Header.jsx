import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


const Header = () => {

  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector((state) => state.theme);
  const path = useLocation().pathname;
  const dispatch = useDispatch();


  // state to set search terms
  const[searchTerm , setSearchTerm] = useState('');
  // To get the location for the search term
  const location = useLocation();
  // To Navigate to the new url according to the new search term parameters
  const navigate = useNavigate();
  useEffect(() => {
    // Fetching all the search parameters
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    // console.log(searchTermFromUrl);
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }

  } , [location.search]);

  const handleSignOut = async() => {
    try{
        const res = await fetch('/api/user/signout' , {
            method : 'POST',
        });
        const data = res.json();
        
        if(!res.ok){
            console.log(data.message);
        }
        else{
            dispatch(signoutSuccess());
        }
    }
    catch(error){
        console.log(error.message);
    }
}

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm' , searchTerm);
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar className='border-b-2'>
      <Link to = '/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Rishank's</span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
        type = 'text'
        placeholder='search...'
        rightIcon={AiOutlineSearch}
        className='hidden lg:inline'
        value = {searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color= 'gray' pill> 
        <AiOutlineSearch/>
      </Button>

      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color = 'gray' pill onClick={() => dispatch(toggleTheme())}>
          {/* Button to toggle the theme */}  
          {theme === 'light' ? <FaSun/> : <FaMoon/>}
        </Button>

        {/* Adding the Profile Photo in the Header */}
        { currentUser ? 
          (<Dropdown arrowIcon = {false} inline label = {<Avatar alt = 'user' img = {currentUser.profilePicture} rounded/>}>
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-mediumctruncate'>@{currentUser.email}</span>  
            </Dropdown.Header>
            <Link to = {'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>) : 
        ( <Link to = '/signin'>
            <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
            </Button>
          </Link>) }    

        <Navbar.Toggle/> 

      </div>

      <Navbar.Collapse>
            <Navbar.Link active = {path === '/'} as = {'div'}>
                <Link to = '/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link active = {path === '/about'} as = {'div'}>
                <Link to = '/about'>About</Link>
            </Navbar.Link>
            <Navbar.Link active = {path === '/projects'} as = {'div'}>
                <Link to = '/projects'>Projects</Link>
            </Navbar.Link>
        </Navbar.Collapse>

    </Navbar>
  )
}

export default Header

// md:order-2 --> To give the order to the div in case of medium and larger screens
// pill --> To make the button Rounded
