'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IoSend } from "react-icons/io5";
import { TbMessageCircleOff,TbArrowLeft } from "react-icons/tb";
import { FaMicrophone } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { addMember, fetchEmployees } from './service/api';

function MessageBox({currentConversation, messages, message, setmessage, handleSendMessage, startRecording, imageSrc, setImageSrc, customerNumber,setChatOpen }) {
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const { isAuth, user } = useSelector(store => store.userReducer);
    const [currentEmployee, setcurrentEmployee] = useState(null)
    const [allemployee, setAllEmployee] = useState([])

    // Trigger file input click
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };


useEffect(() => {
    const fetchEmployees = async () => {
        setAllEmployee([])
        let res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/users`,{ withCredentials: true });
        res.data.users.map(user => {
          
            setAllEmployee((prev) => [...prev, {empId:user._id, empName:user.name, empEmail:user.email}])
          
        })
      }
    if(currentConversation.employeeId){
        setcurrentEmployee(currentConversation.employeeId)
    }
    else{
        setcurrentEmployee(null)
        fetchEmployees()
    }
    

   

  
}, [currentConversation])

    // Handle image change event
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            console.log("this is the image data ", reader.result);
            setImageSrc(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
   
    
    useEffect(() => {
        scrollToBottom();
        console.log("this is messg ",messages)
    }, [messages]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

    const handleChange = async(event) => {
      const selectedOption = event.target.selectedOptions[0];
      const selectedId = selectedOption.getAttribute('data-key');
      setSelectedEmployeeId(selectedId);
      console.log('Selected Employee ID:', selectedId);
     

        };
    const handleTransferClick=async ()=>{
        await addMember({memberId:selectedEmployeeId},currentConversation._id)
        console.log("trasnfered")
    }
    return (
        <div>
            <div className='header py-2 shadow-md flex items-center justify-between px-4'>
                <div className='flex items-center gap-3'>
                    <button className='md:hidden block text-gray-800' onClick={() => setChatOpen(false)}><TbArrowLeft/></button>
                    <img class="rounded-full w-16 h-16" src="Images/customer.png" />
                    <div>
                        <h2 className='text-gray-800'>{customerNumber.customerNumber}</h2>
                    </div>

                </div>
                <div>
                    {
                        currentEmployee? currentEmployee.name
                        :  
                        <>
                        <select className='text-gray-800 ' onChange={handleChange}>
                        <option>Transfer Chat</option>
                        {
                            allemployee && allemployee.map((data) => (<option data-key={data.empId}>{data.empName}</option>))
                        }
                    </select>
                    <button onClick={handleTransferClick} type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Trasnfer</button>

                    </>
               

                    }
                   </div>

                
            </div>
            <div className="w-full px-5 flex flex-col justify-end">
                <div className="   md:h-[69vh]  max-h-[75vh] overflow-y-auto flex flex-col mb-4">
                    {messages.map((msg) => (
                        msg.senderId === user._id ?
                            (
                                <div className="flex justify-end mb-4" key={msg.id}>
                                    <div className="mr-2 p-2 md:py-3 md:px-4 shadow-md text-black/80 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl">
                                        {msg.type === "audio" ? (
                                            <audio src={msg.sourceLink} controls autoPlay />
                                        ) : msg.type === "img" ? (
                                            <>
                                                <img
                                                    src={msg.sourceLink}
                                                    className="object-cover h-[30vh] w-[30vh]"
                                                    alt=""
                                                />
                                                <h3>{msg.text}</h3>
                                            </>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-start mb-4" key={msg.id}>
                                    <img
                                        src="Images/customer.png"
                                        className="object-cover h-10 w-10 rounded-full"
                                        alt=""
                                    />
                                    <div className="ml-2 p-2 space-y-3 md:py-3 md:px-4 text-black/80 shadow-md rounded-br-3xl rounded-tr-3xl rounded-tl-xl">
                                        {msg.type === "audio" ? (
                                            <audio src={msg.sourceLink} controls autoPlay />
                                        ) : msg.type === "img" ? (
                                            <>
                                                <img
                                                    src={msg.sourceLink}
                                                    className="object-cover h-[30vh] w-[30vh]"
                                                    alt=""
                                                />
                                                <h3>{msg.text}</h3>
                                            </>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            )
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {
                user.role=="admin"?

                <div className="md:p-5 flex flex-row justify-center items-center space-x-4 px-4">
                <div className="space-y-3 relative">
                    {imageSrc && (
                        <div className="p-6 bg-gray-200 border absolute bottom-[90px] left-[10px] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <img src={imageSrc} className="w-50 h-40" alt="Selected" />
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <button onClick={handleButtonClick} className="bg-gradient text-white font-bold p-2 md:py-3 md:px-4 rounded-full md:rounded text-sm md:text-4xl">
                        <CiImageOn />
                    </button>
                </div>
                <input
                    className="w-full outline-none border border-gray-50 text-black/80 shadow-md py-2 md:py-4 px-3 rounded-xl"
                    type="text"
                    placeholder="type your message here..."
                    onChange={(e) => setmessage(e.target.value)}
                    value={message}
                />
                <button className="bg-gradient font-bold text-white p-2 md:py-3 md:px-4 rounded-full md:rounded text-sm md:text-4xl" onClick={handleSendMessage}>
                    <IoSend />
                </button>
                <button className="bg-gradient font-bold text-white p-2 md:py-3 md:px-4 rounded-full md:rounded text-sm md:text-4xl" onClick={startRecording}>
                    <FaMicrophone />
                </button>
            </div>
  
        :""
            }
                 </div>
    );
}

export default MessageBox;
