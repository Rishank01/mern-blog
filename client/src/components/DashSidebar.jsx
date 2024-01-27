import { Sidebar } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';

export default function DashSidebar() {

    const [tab , setTab] = useState('');
    const location = useLocation();
    
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      // console.log(tabFromUrl);
      if(tabFromUrl){
        setTab(tabFromUrl);
      }
    } , [location.search]);

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Link to = '/dashboard?tab=profile'>
                <Sidebar.Item active = {tab === 'profile'} icon={HiUser} label = {"User"} labelColor = 'dark'>
                    Profile
                </Sidebar.Item>
            </Link>
            <Sidebar.Item active icon={HiArrowSmRight} className = 'cursor-pointer'>
                Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}