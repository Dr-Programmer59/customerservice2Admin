'use client';

import { MenuContext } from '@/context/MenuContext';
import React, { useContext, useEffect, useState } from 'react';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import UserAreaSelectBox from './UserAreaSelectBox';
import LanguageSelectBox from './LanguageSelectBox';
import { IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/lib/actions/user';

const MainHeader = () => {
  const initialTheme =
    typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';
  const [theme, setTheme] = useState(initialTheme);
  const { toggle } = useContext(MenuContext);
  const dispatch = useDispatch();

 
 const handleLogout=async(e)=>{
  e.preventDefault();

  const confirm = window.confirm("are you sure you want to logout");
  if(confirm){
    let res = await dispatch(logout());
  }

 

// Handle form submission here

 }
 

  return (
    <div className='bg-white dark:bg-slate-800 dark:text-white flex justify-between items-center px-4 h-12 mb-4'>
      <div>Customer Service</div>
      <div className='flex justify-center items-center gap-3'>
        
      <div>
       
        </div>
        <button className='flex justify-center items-center gap-3' onClick={handleLogout}>
          Logout
          <IoLogOut />
        </button>
        <div onClick={toggle} className='lg:hidden'>
          <FaBars className='cursor-pointer' />
        </div>
       
      </div>
    </div>
  );
};

export default MainHeader;
