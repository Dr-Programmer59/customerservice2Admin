// pages/index.js
'use client'
import { useState, useRef, useEffect } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
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
  

  const [audio] = useState(new Audio( "https://firebasestorage.googleapis.com/v0/b/customer-service-6f1c0.appspot.com/o/audio%2Ff1ff08c9-28fd-4c82-9ec7-314040435586.wav?alt=media&token=56abc7ad-eaab-4e44-83aa-20c288bc4e4f"));
  const [duration, setDuration] = useState(0);
  const checkDuration = () => {
   

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
      <div>
      <h1>Audio Player</h1>
    <video src='https://firebasestorage.googleapis.com/v0/b/customer-service-6f1c0.appspot.com/o/audio%2Ff1ff08c9-28fd-4c82-9ec7-314040435586.wav?alt=media&token=56abc7ad-eaab-4e44-83aa-20c288bc4e4f' controls/>
    </div>


    </div>
  );
}
