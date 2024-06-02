'use client'
import React, { useState } from 'react'

function page() {
    
    const [chatM, setchatM] = useState([1,2,3,4,5,6,7,8,9,10,12])
    const [showchat, setshowchat] = useState(false)

  return (
    <div class="flex flex-row space-x-6 justify-center ">
    <div >
        {/* <!-- Card --> */}
        <div class=" max-w-[340px] h-[90vh] bg-white shadow-lg rounded-lg overflow-y-auto">
            {/* <!-- Card header --> */}
            <header class="pt-6 pb-4 px-5 border-b border-gray-200">
                <div class="flex justify-between items-center mb-3">
                    {/* <!-- Image + name --> */}
                    <div class="flex items-center">
                        <a class="inline-flex items-start mr-3" href="#0">
                            <img class="rounded-full" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-48-01_nugblk.jpg" width="48" height="48" alt="Lauren Marsano" />
                        </a>
                        <div class="pr-1">
                            <a class="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                                <h2 class="text-xl leading-snug font-bold">Lauren Marsano</h2>
                            </a>
                            <a class="block text-sm font-medium hover:text-indigo-500" href="#0">@lauren.mars</a>
                        </div>
                    </div>
                    {/* <!-- Settings button --> */}
                   
                </div>
              
             
            </header>
            {/* <!-- Card body --> */}
            <div class="py-3 px-5">
                <h3 class="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
                {/* <!-- Chat list --> */}
                <div class="divide-y divide-gray-200">
                    {/* <!-- User --> */}
                    {
                        chatM.map((val)=>(
                            <button  onClick={()=>setshowchat(!showchat)} class="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                            <div class="flex items-center">
                                <img class="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-01_pfck4u.jpg" width="32" height="32" alt="Marie Zulfikar" />
                                <div>
                                    <h4 class="text-sm font-semibold text-gray-900">Marie Zulfikar</h4>
                                    <div class="text-[13px]">The video chat ended · 2hrs</div>
                                </div>
                            </div>
                        </button>
                        ))
                    }
                  
                  
                </div>
            </div>
          
        </div>
    </div>

    
    <div class="">
        {/* <!-- Card --> */}
        <div class={`w-[120vh] h-[90vh] bg-white shadow-lg rounded-lg lg:w-[150vh]  ${showchat?'block': 'md:block hidden'}   `} >
          </div>
    </div>
    </div>
  )
}

export default page