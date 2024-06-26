'use client';

import React, { useContext, useState } from 'react';
import MainHeader from './leyout-sections/MainHeader';

import { MenuContext } from '@/context/MenuContext';
import MainSidebar from './leyout-sections/MainSidebar';
import MobileButtonNavigation from './leyout-sections/MobileButtonNavigation';
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/lib/actions/user';
import { usePathname, useRouter } from 'next/navigation'
import Erorr from '../Erorr';
import { ToastContainer,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MainLayout = ({ children }) => {
  const { open } = useContext(MenuContext);
  const { isAuth, user } = useSelector(store => store.userReducer);


  const router = useRouter();
  const pathname = usePathname();
  const [isLogin, setisLogin] = useState(true)
  const [error, seterror] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

      let res = await dispatch(login(formData['email'], formData['password']));
      if(!res){
        setisLogin(false)
        seterror(true)

      }
      else{
        setisLogin    (true)
      }

    // Handle form submission here

  };
  const checkHideHeader = () => {
    const list = ['/user-chat', '/dashboard']

    let hide = false;
    for (const index in list) {
        if (pathname.includes(list[index])) {
            hide = true;
            break;
        } else {
            hide = false;
        }
    }
    return hide
}

if (checkHideHeader()) {
    return <>
   
        <div className=' bg-grey md:p-5'>{children}</div>
    
    </>
}
  return (<>
    {
      isAuth? <div className='min-h-screen bg-gray-200 dark:bg-slate-700'>
      <MainSidebar />
      <div className={''}>
        <MainHeader />
        <main className='lg:ml-[280px]'>{children}</main>
        <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition= {Bounce}
            />
      </div>
      
    </div>:
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">SignIn For Admin</h2>
        </div>
        {
          isLogin==false?
        <Erorr title={"Error"} message={"invalid Email or password (or only Admin can Signin)"}/>
          :""
        }

        <form className="mt-8 space-y-10" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-2">
            
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" name="email" type="email" required onChange={handleChange} value={formData.email} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" required onChange={handleChange} value={formData.password} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign in
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition= {Bounce}
            />
    </div>
    }
  </>
   
  );
};

export default MainLayout;
