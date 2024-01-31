import { Sidebar } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {

    const [tab , setTab] = useState('');
    const location = useLocation();

    const dispatch = useDispatch();
    
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      // console.log(tabFromUrl);
      if(tabFromUrl){
        setTab(tabFromUrl);
      }
    } , [location.search]);


    const handleSignOut = async() => {
      try{
          const res = await fetch('/api/user/signout' , {
              method : 'POST',
          });
          const data = res.json();
          
          if(!res.ok){
              console.log(error.message);
          }
          else{
              dispatch(signoutSuccess());
          }
      }
      catch(error){
          console.log(error.message);
      }
  }

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Link to = '/dashboard?tab=profile'>
                <Sidebar.Item active = {tab === 'profile'} icon={HiUser} label = {"User"} labelColor = 'dark' as = 'div'>
                    Profile
                </Sidebar.Item> 
            </Link>
            <Sidebar.Item active icon={HiArrowSmRight} className = 'cursor-pointer' onClick = {handleSignOut}>
                Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
