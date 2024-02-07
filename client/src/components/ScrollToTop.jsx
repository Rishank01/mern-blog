import React from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0,0); // To scroll to the top of the window page..
    },[pathname]);

  return null; // null return
}

