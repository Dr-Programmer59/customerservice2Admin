'use-client'
import dynamic from 'next/dynamic';

import 'media-chrome';

const AudioPlayer = () => {

  

  return (
    <media-controller audio>
      <audio
        slot="media"
        src="https://stream.mux.com/O4h5z00885HEucNNa1rV02wZapcGp01FXXoJd35AHmGX7g/audio.m4a"
        crossorigin
      ></audio>
      <media-control-bar>
        <media-play-button></media-play-button>
        <media-time-display></media-time-display>
        <media-time-range
          style={{
            '--media-range-track-background': 'transparent',
            '--media-time-range-buffered-color': 'white',
            '--media-range-bar-color': 'rgb(79 70 229)',
            '--media-range-track-height': '0.5rem',
            '--media-range-thumb-background': 'rgb(79 70 229)',
            '--media-range-thumb-box-shadow': '0 0 0 2px rgb(255 255 255 / 0.9)',
            '--media-range-thumb-width': '0.25rem',
            '--media-range-thumb-height': '1rem',
            '--media-preview-time-text-shadow': 'transparent',
          }}
        ></media-time-range>
        <media-duration-display></media-duration-display>
        <media-mute-button></media-mute-button>
      </media-control-bar>
    </media-controller>
  );
};

export default AudioPlayer;
