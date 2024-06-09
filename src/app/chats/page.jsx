'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import socket from '@/components/socket';
import MessageBox from '@/components/MessageBox';
import axios from 'axios';
import { storage } from '@/components/firebase';

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { clearnewMessages, createConversation, getAdminConversation, getConversation, getMessages, newMessages } from '@/components/service/api';
import { current } from '@reduxjs/toolkit';

import { CgProfile } from "react-icons/cg";
import { v4 as uuidv4 } from 'uuid';

function page() {
  const { isAuth, user } = useSelector(store => store.userReducer);
  useEffect(() => {
    console.log(user)
    socket.emit("new-connection", { name: user.name, socketId: socket.id, role: user.role })
  }, [])

  const [message, setmessage] = useState("")
  const [msginfo, setmsginfo] = useState({})
  const [messages, setmessages] = useState([])
  const [currentCustomer, setcurrentCustomer] = useState("")
  const [recording, setRecording] = useState(false);
  const audioBlob = useRef()
  const mediaRecorder = useRef();
  const [imageSrc, setImageSrc] = useState(null);
  const [progress, setProgress] = useState(0);
  const [customerNumbers, setcustomerNumbers] = useState([ ])
  const [selectedChat, setSelectedChat] = useState({});
  const [chatOpen, setChatOpen] = useState(false)
  const [showchat, setshowchat] = useState(false)
  const [currentConversation, setcurrentConversation] = useState({})
  const [chatType, setChatType] = useState("pendings")
  const [chatsFilter,setChatsFilter] = useState([]);
  const audioRef = useRef(null);
const [recordingDelete, setrecordingDelete] = useState(false)

  const sortByRecentUpdate = (array) => {
    return array.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };
  const fetchContacts=async ()=>{
    
    let conversationdata=await getAdminConversation();
    console.log("the conversation data ",conversationdata)
    conversationdata=sortByRecentUpdate(conversationdata)
    let customerData=[]
    let checknewmsg=false;
    conversationdata.forEach((val)=>{
      try{
        if(val.roomId){

         

          
          customerData.push({customerId:val.roomId._id,customerNumber:val.roomId.phone,lastmsg:val.message,employeeId: val.employeeId,newMessages:val.newMessages})
       

        }
      }catch{
        console.log("some eerror")
      }

    })
    setcustomerNumbers(customerData);
  }

  useEffect(() => {
  

    fetchContacts();
    



  }, [])
  
  const handleUploadAudio = (blob) => {
    if (blob) {
      const randomId = crypto.randomUUID();
      const file = new File([blob], `${randomId}.wav`, { type: 'audio/wav' });
      const storageRef = ref(storage, `audio/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("this is testing")
            setRecording(false);
            socket.emit("send-msg", {
              message: downloadURL,
              socketId: socket.id,
              category: user.category,
              role: "employee",
              customerSocket: currentCustomer,
              msgType: "audio"
            });
            setRecording(false)
            console.log("this is audio blob", downloadURL)


            let data = {
              conversationId: currentConversation._id,
              senderId:user._id,
              roomId: currentCustomer,
              text: message,
              sourceLink: downloadURL,
              type: "audio"
            }
            socket.emit("send-msg", data);
            newMessages(data);
            setmessages((prev) => [...prev, data])

            console.log('File available at', downloadURL);
          });
        }
      );
    }
  };
  useEffect(() => {
    
    if(recordingDelete){
     console.log("this is delte recording delete1",recordingDelete)
     setRecording(false);
     mediaRecorder.current=null;
    setTimeout(() => {
      setrecordingDelete(false)
    }, 2000);
   
    }
    
  }, [recordingDelete])
  const startRecording = async () => {
    try {
      if (recording == false) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);

        const chunks = [];

        mediaRecorder.current.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.current.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          audioBlob.current = blob;
          handleUploadAudio(blob)

        };

        mediaRecorder.current.start();
        setRecording(true);
      }
      else if (recording == true) {

        mediaRecorder.current.stop();
        setRecording(false);


      } // 5 seconds recording time, you can adjust as needed
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };


  const handleNewCustomer = (data) => {
    createConversation({ roomId: data.customerId, senderId: user._id, receiverId: data.customerId })
    setcustomerNumbers((prev) => (!prev.includes(data) ? [...prev, data] : [...prev]));
    fetchContacts();

  }

  const handleReceiveMessage = async(msg) => {
    // moveCustomerToTop(data.customerNumber)
    console.log(msg,"msg")
    console.log(currentCustomer,"conversation")
    if(msg.roomId== currentConversation.roomId){
      console.log("already in room")
      setmessages((prev) => [...prev, msg])
      await clearnewMessages(msg.conversationId)
 
    }
  await fetchContacts();
   

  }

  const handleWaitingCustomer = (data) => {

    data.forEach((customer) => {
      setcustomerNumbers(prev => [...prev, customer.customerNumber]);

    })
  }



  const handleCustomerClick =async(e, chat) => {
    console.log("working")
    setSelectedChat(chat)
    setChatOpen(true);
    const key = e.target.getAttribute('data-key');
    setcurrentCustomer(key)
    console.log("this is working as fuck")
    const data =await getConversation({ roomId: key })
    console.log("the data is ",data)
    setcurrentConversation(data)
    const messagedata=await getMessages(data._id)
    const clearMsg=await clearnewMessages(data._id);
    setmessages([...messagedata])
    setcustomerNumbers((prev)=>{
      prev.forEach(val=>{
        if(val.customerId==key && val.hasOwnProperty("show"))
          {
            delete val["show"]
          }
      })
      fetchContacts();

      return prev
    })
  }

const getMessage = async () => {
    const key = selectedChat.customerId;
    
    const data =await getConversation({ roomId: key })
    console.log(data)
    const messagedata=await getMessages(data._id)
    setmessages([...messagedata])
}
  useEffect(() => {
    if(selectedChat.customerId){
      
      getMessage();
    }
  },[selectedChat])

  const handleUpload = useCallback(() => {
    if (imageSrc) {
      const randomId = uuidv4();;
      const storageRef = ref(storage, `images/${randomId}-${imageSrc.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageSrc);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("your downloaded url is", downloadURL)
            let data = {
              conversationId: currentConversation._id,
              roomId: currentCustomer,
              senderId:user._id,
              text: message,
              sourceLink: downloadURL,
              type: "img"
            }
            socket.emit("send-msg", data);
             newMessages(data);
              setmessages((prev) => [...prev, data])


          });
        }
      );
    }
  }, [imageSrc, currentConversation, user, message]);
  
  const handleSendMessage = (e) => {
    
    console.log("sending msg to ", currentCustomer);
    console.log("sending msg to ", message)
    console.log("current conversation ",currentConversation)
    if (imageSrc) {
      handleUpload();
    }
    else {
      let msg = {
        conversationId: currentConversation._id,
        roomId: currentCustomer,
        senderId:user._id,
        text: message,
        type: "text"
      }
      socket.emit("send-msg", msg);
       newMessages(msg);
      setmessages((prev) => [...prev, msg])
      fetchContacts();
     




    }
    setmessage("")
    setImageSrc(null)
  }
  useEffect(() => {
    socket.on("new-request:customer", handleNewCustomer)
    socket.on("waiting-customer", handleWaitingCustomer)
    socket.on("receive-msg", handleReceiveMessage)
    socket.on("adapter:Changes",async()=>{
      await fetchContacts();

    })
    return () => {

      socket.off("new-request:customer", handleNewCustomer)
      socket.off("waiting-customer", handleWaitingCustomer)
      socket.off("receive-msg", handleReceiveMessage)

    }
  }, [socket,handleNewCustomer,handleWaitingCustomer,handleReceiveMessage])



  //filter chats on toggle chat types 
  useEffect(() => {
    setChatsFilter(prev => {
      if(chatType == "chats"){
        return customerNumbers.filter(con => con.employeeId != undefined);
      }
      return customerNumbers.filter(con => !con.employeeId);
    })
    customerNumbers.forEach(con => {
      console.log(con.employeeId)
    })
  },[customerNumbers,chatType])

  return (
    <div class="flex flex-row space-x-6 justify-center ">
      <div >

        <div class=" max-w-[340px] h-[90vh] bg-white shadow-lg rounded-lg overflow-y-auto">
          <header class="pt-6 pb-4 px-5 border-b border-gray-200">
            <div class="flex justify-between items-center mb-3">
              {/* <!-- Image + name --> */}
              
<div class="flex items-start gap-2.5">
    <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image">
    <div class="flex flex-col gap-1">
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
        </div>
        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <button class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600" type="button">
                    <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 16">
                        <path d="M3 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm7 0H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z"/>
                    </svg>
                </button>
                <svg class="w-[145px] md:w-[185px] md:h-[40px]" aria-hidden="true" viewBox="0 0 185 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="17" width="3" height="6" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="7" y="15.5" width="3" height="9" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="21" y="6.5" width="3" height="27" rx="1.5" fill="#6B7280"class="dark:fill-white"/>
                    <rect x="14" y="6.5" width="3" height="27" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="28" y="3" width="3" height="34" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="35" y="3" width="3" height="34" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="42" y="5.5" width="3" height="29" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="49" y="10" width="3" height="20" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="56" y="13.5" width="3" height="13" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="63" y="16" width="3" height="8" rx="1.5" fill="#6B7280" class="dark:fill-white"/>
                    <rect x="70" y="12.5" width="3" height="15" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="77" y="3" width="3" height="34" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="84" y="3" width="3" height="34" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="91" y="0.5" width="3" height="39" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="98" y="0.5" width="3" height="39" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="105" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="112" y="6.5" width="3" height="27" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="119" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="126" y="11.5" width="3" height="17" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="133" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="140" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="147" y="7" width="3" height="26" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="154" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="161" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="168" y="13.5" width="3" height="13" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="175" y="16" width="3" height="8" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="182" y="17.5" width="3" height="5" rx="1.5" fill="#E5E7EB" class="dark:fill-gray-500"/>
                    <rect x="66" y="16" width="8" height="8" rx="4" fill="#1C64F2"/>
                </svg>
                <span class="inline-flex self-center items-center p-2 text-sm font-medium text-gray-900 dark:text-white">3:42</span>
            </div>
        </div>
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
    </div>
    <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
        </svg>
    </button>
    <div id="dropdownDots" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reply</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Forward</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Copy</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
            </li>
        </ul>
    </div>
</div>

              <div class="flex items-center">
                <a class="inline-flex items-start mr-3" href="#0">
                  <img class="rounded-full" src="Images/admin.png" width="48" height="48" alt="Lauren Marsano" />
                </a>
                <div class="pr-1">
                  <a class="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                    <h2 class="text-xl leading-snug font-bold">{user?.role == "sub admin" ? "SubAdmin Account" : "Admin Account"}  </h2>
                  </a>
                  <a class="block text-sm font-medium hover:text-indigo-500" href="#0">{user?.role == "sub admin" ? "@SUBADMIN" : "@ADMIN"}</a>
                </div>
              </div>
              {/* <!-- Settings button --> */}

            </div>


          </header>
          <div class="py-3 px-5">
            <h3 class="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
            {
              user?.role != "sub admin" && 
            <div className='flex justify-between items-center my-5'>

              <button onClick={() => setChatType('chats')} className={`px-2 pb-1 text-gray-800 text-md font-semibold border-b-2 ${chatType == "chats" ? 'border-[#2234AE]' : ''} `}>Chats</button>
              <button onClick={() => setChatType('pendings')} className={`px-2 pb-1 text-gray-800 text-md font-semibold border-b-2 ${chatType == "pendings" ? 'border-[#2234AE]' : ''}`}>Pending</button>
            </div>
            }
            
            <div class="divide-y divide-gray-200">
              
              {
                chatsFilter.map((detail) => (
                  <button onClick={(e) => handleCustomerClick(e, detail)} class="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50" data-key={detail.customerId}>
                    <div class="flex items-center" data-key={detail.customerId}>
                      <img class="rounded-full items-start flex-shrink-0 mr-3" src="Images/customer.png" width="32" height="32" alt="Marie Zulfikar" data-key={detail.customerNumber} />
                      <div data-key={detail.customerId}>
                        <h4 class="text-sm font-semibold text-gray-800" data-key={detail.customerId}>{detail.customerNumber}</h4>
                        <div class="text-[13px] text-gray-500" data-key={detail.customerId}>{detail.lastmsg}</div>
                      </div>
                      
                      {
                        detail.newMessages && detail.newMessages>0?
                    <div class="relative inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 border-2 border-white rounded-full -top-2 -end-2 right-2 ml-5 dark:border-gray-900">{detail.newMessages}</div>
                        
                        :""
                      }
                     
                    </div>

                  </button>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      {/* ${showchat?'block': 'hidden'} */}
      <div class={`w-[90vw] md:w-[60vw] h-[90vh] bg-white shadow-lg rounded-lg lg:w-[130vh] md:block absolute md:static   ${chatOpen ? "left-0" : "left-[-200%]"}  `} >
      
      {
        Object.keys(currentConversation).length != 0?
      messages && <MessageBox socket={socket} setrecordingDelete={setrecordingDelete} currentConversation={currentConversation} messages={messages} message={message} setmessage={setmessage} setChatOpen={setChatOpen} handleSendMessage={handleSendMessage} startRecording={startRecording} imageSrc={imageSrc} setImageSrc={setImageSrc} role={"admin"} customerNumber={selectedChat} setcustomerNumbers={setcustomerNumbers} setSelectedChat={setSelectedChat} isSubadmin={user?.role == "sub admin" ? true : false} customerNumbers={customerNumbers}/>
      :""
      }
    
  </div>
    </div>


  )
}

export default page