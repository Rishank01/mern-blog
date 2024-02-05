import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashPosts from '../components/DashPosts';
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar';
import DashUsers from '../components/DashUsers';

const Dashboard = () => {

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
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar/>
      </div>
      
      {/* Profile and other stuff... */}
      {tab === 'profile' && (<DashProfile/>)}

      {/* posts... */}
      {tab === 'posts' && (<DashPosts/>)}

      {/* users */}
      {tab === 'users' && <DashUsers/>}
    </div>
  )
}

export default Dashboard
