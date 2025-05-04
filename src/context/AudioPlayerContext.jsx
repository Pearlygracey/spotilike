// src/context/AudioPlayerContext.jsx
import React, { createContext, useRef, useState, useEffect, useContext } from 'react';

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // update progress
  useEffect(() => {
    const audio = audioRef.current;
    const update = () => setProgress(audio.currentTime / audio.duration || 0);
    audio.addEventListener('timeupdate', update);
    return () => audio.removeEventListener('timeupdate', update);
  }, []);

  const playTrack = (track) => {
    const audio = audioRef.current;
    if (currentTrack?.file !== track.file) {
      audio.src = track.file;
      setCurrentTrack(track);
      audio.currentTime = 0;
    }
    audio.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const seek = (pct) => {
    const audio = audioRef.current;
    audio.currentTime = pct * audio.duration;
    setProgress(pct);
  };

  return (
    <AudioPlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      progress,
      playTrack,
      togglePlay,
      seek,
      audioRef
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
