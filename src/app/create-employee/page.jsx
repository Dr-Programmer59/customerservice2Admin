'use client'
import Erorr from '@/components/Erorr';
import Info from '@/components/info';
import { register } from '@/lib/actions/user';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'

const page = () => {
  const [error, seterror] = useState(false)
  const [sucess, setsucess] = useState(false)

  const dispatch=useDispatch();


  const [formData, setFormData] = useState({
    "name":"",
    "email":"",
    "role":"",
    "password":""
  });
  const handleChangeInput = (event) => {
    
    const fieldName = event.target.name;
    let fieldValue;
  
    // Check if the target is an input or select element
    if (event.target.nodeName === 'INPUT') {
      fieldValue = event.target.value;
    } else if (event.target.nodeName === 'SELECT') {
      fieldValue = event.target.options[event.target.selectedIndex].value;
    }
  
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });
  };
  const creatEmployee = async () => {
    try {
      let res = await dispatch(register(formData));
      if (res) {
        setsucess(true);
      }
      else {
        seterror(true)

      }
    } catch (err) {
      console.log(err,"something err")
      seterror(true)
    }

  }

return (


  <div class="max-w-[170vh] h-[80vh] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex  flex-col justify-center items-center">
      {
          error?
          <Erorr title={"Error"} message={"something went wrong :("}/>:""
        }

      {
          sucess?
          <Info title={"Done"} message={"employee created sucessfully"}/>:""
        }
    <div class="mb-5 w-[100vh]">
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
      <input name='name'  value={formData.name} onChange={(e) => handleChangeInput(e)} type="text" id="name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="" required />
    </div>
    <div class="mb-5 w-[100vh]">
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
      <input name='email' value={formData.email} onChange={(e) => handleChangeInput(e)} type="email" id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@gmail.com" required />
    </div>
    <div  class="mb-5 w-[100vh]">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
      <input name='password' value={formData.password} onChange={(e) => handleChangeInput(e)} type="text" id="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
    </div>
    <div class="mb-5 w-[100vh]">
      <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>

      <select name='role'  onChange={handleChangeInput} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <option>Select role</option>
        <option>sub admin</option>
        <option>employee</option>

      </select>

    </div>


    <button onClick={creatEmployee} class="text-white w-[100vh] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create New Employee</button>
  </div>

);
};

export default page;
