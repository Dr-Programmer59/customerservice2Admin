'use client'
import { useRef } from 'react';

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);

  const playAudio = () => {
    audioRef.current.play();
  };

  const pauseAudio = () => {
    audioRef.current.pause();
  };

  return (
    <div>
      <audio ref={audioRef} src={src} controls>
        Your browser does not support the audio element.
      </audio>
      <button onClick={playAudio}>Play</button>
      <button onClick={pauseAudio}>Pause</button>
    </div>
  );
};

export default AudioPlayer;
