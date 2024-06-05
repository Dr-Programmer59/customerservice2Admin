'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IoSend } from "react-icons/io5";
import { TbMessageCircleOff,TbArrowLeft } from "react-icons/tb";
import { FaMicrophone } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { addMember, fetchEmployees } from './service/api';
import { FaFileImage } from "react-icons/fa";
import Recording from "./Recording2.json"
import Lottie from "lottie-react";
import { IoMdMic } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

function MessageBox({socket,setrecordingDelete,currentConversation, messages, message, setmessage, handleSendMessage, startRecording, imageSrc, setImageSrc, customerNumber,setChatOpen }) {
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const { isAuth, user } = useSelector(store => store.userReducer);
    const [currentEmployee, setcurrentEmployee] = useState(null)
    const [allemployee, setAllEmployee] = useState([])
    const [currImage, setcurrImage] = useState("")
    const [isRecording, setisRecording] = useState(false)
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
        setImageSrc(file)
        reader.onload = () => {
            setcurrImage(reader.result);
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
        socket.emit("transfer:employee",{userId:selectedEmployeeId})
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
                <div id="msgbox" className="   overflow-y-auto flex flex-col mb-4">
                    {messages.map((msg) => (
                        msg.senderId === user._id ?
                            (
                                <div className="flex justify-end mb-4" key={msg.id}>
                                    <div className="mr-2 p-2 md:py-3 md:px-4 shadow-md text-black/80 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl bg-yellow-100">
                                        {msg.type === "audio" ? (
                                            <audio src={msg.sourceLink} controls />
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
                                            <audio src={msg.sourceLink} controls  />
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
                <div class="relative ml-3 w-[95%] h-[6vh] flex justify-center items-center" >
                <div class={`absolute inset-y-0 start-0 flex items-center ps-3.5 ${isRecording ? "text-red-500" : ""}`}>
                    {
                        isRecording ?
                            <button onClick={() => { setrecordingDelete(true); setisRecording(!isRecording); console.log("delete ") }}>
                                <RiDeleteBin6Line className='w-[30px] h-[30px]' />
                            </button>
                            :
                            <>
                                {imageSrc && (
                                    <div className='p-6 bg-gray-200 border absolute bottom-[90px] left-[10px] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                                        <img src={currImage} className='w-50 h-40' alt="Selected" />
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                                <button onClick={handleButtonClick} >
                                    <FaFileImage className='w-[30px] h-[30px]' />
                                </button>
                            </>
                    }

                </div>
                <input
                    onChange={(e) => setmessage(e.target.value)}
                    value={message}
                    type="text" id="input-group-1" class="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-3 ps-10 pl-[50px] pr-[30px]  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type a message " />
                
                {

                message!="" || imageSrc?
                <div class="absolute inset-y-0 end-0  flex items-center pr-4 ">
                            <button onClick={handleSendMessage}>
                                <IoSend className='w-[35px] h-[35px]' />
                            </button>




                        </div>

                :
                <>
                
                {
                    isRecording == false ?
                        <div class="absolute inset-y-0 end-0  flex items-center pr-4 ">
                            <button onClick={() => { startRecording(); setisRecording(!isRecording); console.log("preessed") }}>
                                <IoMdMic className='w-[35px] h-[35px]' />
                            </button>




                        </div>
                        :
                        <>
                            <div class="absolute inset-y-0 end-0 pr-4  flex items-center  ">
                                <button onClick={() => { startRecording(); setisRecording(!isRecording); console.log("preessed") }}>
                                    <Lottie className='w-[30px] h-[40px] ' animationData={Recording} loop={true} />
                                </button>

                            </div>
                        </>

                }
                </>


            }
            </div>
                
            //     <div className="md:p-5 flex flex-row justify-center items-center space-x-4 px-4">
            //     <div className="space-y-3 relative">
            //         {imageSrc && (
            //             <div className="p-6 bg-gray-200 border absolute bottom-[90px] left-[10px] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            //                 <img src={currImage} className="w-50 h-40" alt="Selected" />
            //             </div>
            //         )}
            //         <input
            //             type="file"
            //             ref={fileInputRef}
            //             onChange={handleImageChange}
            //             style={{ display: 'none' }}
            //         />
            //         <button onClick={handleButtonClick} className="bg-gradient text-white font-bold p-2 md:py-3 md:px-4 rounded-full md:rounded text-sm md:text-4xl">
            //             <CiImageOn />
            //         </button>
            //     </div>
            //     <input
            //         className="w-full outline-none border border-gray-50 text-black/80 shadow-md py-2 md:py-4 px-3 rounded-xl"
            //         type="text"
            //         placeholder="type your message here..."
            //         onChange={(e) => setmessage(e.target.value)}
            //         value={message}
            //     />
            //     <button className="bg-gradient font-bold text-white p-2 md:py-3 md:px-4 rounded-full md:rounded text-sm md:text-4xl" onClick={handleSendMessage}>
            //         <IoSend />
            //     </button>
            //     <button className="bg-gradient font-bold text-white p-2 md:py-3 md:px-4 rounded-full md:rounded text-sm md:text-4xl" onClick={startRecording}>
            //         <FaMicrophone />
            //     </button>
            // </div>
  
        :""
            }
                 </div>
    );
}

export default MessageBox;
