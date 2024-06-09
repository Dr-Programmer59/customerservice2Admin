// pages/index.js
'use client'
import { useState, useRef, useEffect } from 'react';
const rectangles = [
  { x: 0, y: 17, width: 3, height: 6 },
  { x: 7, y: 15.5, width: 3, height: 9 },
  { x: 21, y: 6.5, width: 3, height: 27 },
  { x: 14, y: 6.5, width: 3, height: 27 },
  { x: 28, y: 3, width: 3, height: 34 },
  { x: 35, y: 3, width: 3, height: 34 },
  { x: 42, y: 5.5, width: 3, height: 29 },
  { x: 49, y: 10, width: 3, height: 20 },
  { x: 56, y: 13.5, width: 3, height: 13 },
  { x: 63, y: 16, width: 3, height: 8 },
  { x: 70, y: 12.5, width: 3, height: 15 },
  { x: 77, y: 3, width: 3, height: 34 },
  { x: 84, y: 3, width: 3, height: 34 },
  { x: 91, y: 0.5, width: 3, height: 39 },
  { x: 98, y: 0.5, width: 3, height: 39 },
  { x: 105, y: 2, width: 3, height: 36 },
  { x: 112, y: 6.5, width: 3, height: 27 },
  { x: 119, y: 9, width: 3, height: 22 },
  { x: 126, y: 11.5, width: 3, height: 17 },
  { x: 133, y: 2, width: 3, height: 36 },
  { x: 140, y: 2, width: 3, height: 36 },
  { x: 147, y: 7, width: 3, height: 26 },
  { x: 154, y: 9, width: 3, height: 22 },
  { x: 161, y: 9, width: 3, height: 22 },
  { x: 168, y: 13.5, width: 3, height: 13 },
  { x: 175, y: 16, width: 3, height: 8 },
  { x: 182, y: 17.5, width: 3, height: 5 }
];
export default function Home() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef(null);
  const [voiceTime, setvoiceTime] = useState(0)

  useEffect(() => {
setTimeout(() => {
    setvoiceTime((prev)=>prev+1);
}, 100);  
  
    
  }, [voiceTime])
  

  const [audio] = useState(new Audio());
  const [duration, setDuration] = useState(0);
  const checkDuration = () => {
    audio.src = "https://firebasestorage.googleapis.com/v0/b/customer-service-6f1c0.appspot.com/o/audio%2Ff1ff08c9-28fd-4c82-9ec7-314040435586.wav?alt=media&token=56abc7ad-eaab-4e44-83aa-20c288bc4e4f"; // Set the audio source dynamically

    // Get duration once metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
      console.log("this is audio duration ",audio.duration)
      setDuration(audio.duration);
    });
  };
  const playAudio = () => {
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };
    // Get duration once metadata is loaded
  useEffect(() => {
  
  checkDuration();
  
  }, [])
  



  return (
    <div>
     
<div class="flex items-start gap-2.5">
    <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image"/>
    <div class="flex flex-col gap-1">
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
        </div>
        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <button onClick={playAudio} class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600" type="button">
                    <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 16">
                        <path d="M3 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm7 0H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z"/>
                    </svg>
                </button>
                <svg class="w-[145px] md:w-[185px] md:h-[40px]" aria-hidden="true" viewBox="0 0 185 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    
                {rectangles.map((rect, index) => (
            <rect
                key={index}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                rx="1.5"
                fill={voiceTime <= rect.x ? "#E5E7EB" : "#6B7280"}
                className={voiceTime <= rect.x ? "dark:fill-white" : "dark:fill-gray-500"}
            />
        ))}

                    <rect x={voiceTime} y="16" width="8" height="8" rx="4" fill="#1C64F2"/>
                </svg>
                <span class="inline-flex self-center items-center p-2 text-sm font-medium text-gray-900 dark:text-white">{duration}</span>
            </div>
        </div>
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
    </div>
  
   
</div>

    </div>
  );
}
