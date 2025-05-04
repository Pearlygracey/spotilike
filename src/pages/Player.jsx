// src/pages/Player.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaRandom,
  FaRedoAlt,
  FaArrowLeft
} from 'react-icons/fa'

// your tracks, now with thumbnail paths
const tracks = [
  {
    id: 'karera',
    title: 'Early Morning',
    author: 'Infraction',
    file: '/Karera.mp3',
    thumbnail: '/thumbnails/1.jpg'
  },
  {
    id: 'multo',
    title: 'Break My Heart (Rameses B Remix)',
    author: "Slushii, Sapientdream, & Rameses B",
    file: '/Multo.mp3',
    thumbnail: '/thumbnails/2.jpg'
  },
  {
    id: 'cant_stop',
    title: "Groove Contol",
    author: "Infraction",
    file: "/Can't_Stop_The_Feeling.mp3",
    thumbnail: '/thumbnails/3.jpg'
  },
  {
    id: 'you_be_in_my_heart',
    title: "On The Top",
    author: "Chillpeach",
    file: "/You'd_Be_In_My_Heart.mp3",
    thumbnail: '/thumbnails/4.jpg'
  }
]

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trackList = tracks
  const currentIndex = trackList.findIndex((t) => t.id === id)
  const track = trackList[currentIndex] || trackList[0]

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [elapsed, setElapsed] = useState('0:00')
  const [duration, setDuration] = useState('0:00')

  // play/pause on id change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setProgress(0)
      setElapsed('0:00')
      setDuration('0:00')
      if (isPlaying) audioRef.current.play()
    }
  }, [id])

  // update elapsed & progress
  const onTimeUpdate = () => {
    const el = audioRef.current
    if (!el) return
    const prog = el.currentTime / el.duration || 0
    setProgress(prog)

    const fmt = (sec) => {
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return `${m}:${s < 10 ? '0' : ''}${s}`
    }
    setElapsed(fmt(el.currentTime))
    setDuration(fmt(el.duration || 0))
  }

  const togglePlay = () => {
    if (!isPlaying) audioRef.current.play()
    else audioRef.current.pause()
    setIsPlaying((p) => !p)
  }
  const skipForward = () => {
    audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10)
  }
  const skipBackward = () => {
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
  }
  const toggleShuffle = () => setShuffle((s) => !s)
  const toggleRepeat = () => {
    setRepeat((r) => !r)
    audioRef.current.loop = !repeat
  }
  const onSeek = (e) => {
    const val = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = val * audioRef.current.duration
      setProgress(val)
    }
  }
  const playNext = () => {
    let nextIndex
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * trackList.length)
    } else {
      nextIndex = (currentIndex + 1) % trackList.length
    }
    navigate(`/player/${trackList[nextIndex].id}`)
    setIsPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pb-24 px-4 pt-6 bg-gradient-to-b from-black to-blue-900 text-white min-h-screen flex flex-col items-center"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 text-xl p-2 rounded-full bg-white/10 backdrop-blur-sm"
      >
        <FaArrowLeft />
      </button>

      {/* Thumbnail & Title card */}
      <div className="w-64 h-64 rounded-2xl mt-24 overflow-hidden mb-6 shadow-xl bg-white/10 backdrop-blur-sm flex-shrink-0">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-2xl font-semibold mb-2 text-center px-2">{track.title}</h3>
      <p className="text-sm font-semibold mb-2 text-center px-2">{track.author}</p>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={onTimeUpdate}
        onEnded={playNext}
      />

      {/* Progress + time */}
      <div className="w-full flex items-center text-xs font-mono text-white/70 mb-4 px-2">
        <span>{elapsed}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={onSeek}
          className="mx-2 flex-1 h-1 bg-gray-600 rounded-lg appearance-none"
        />
        <span>{duration}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full px-6 space-x-4">
        <button
          onClick={toggleShuffle}
          className={`p-3 rounded-full transition ${shuffle ? 'bg-[#ED0068]' : 'bg-white/10 backdrop-blur-sm'}`}
        >
          <FaRandom />
        </button>
        <button
          onClick={skipBackward}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-full"
        >
          <FaBackward />
        </button>
        <button
          onClick={togglePlay}
          className="p-5 bg-gradient-to-r from-[#ED0068] to-[#D84278] rounded-full shadow-lg transform transition-transform hover:scale-110"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={skipForward}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-full"
        >
          <FaForward />
        </button>
        <button
          onClick={toggleRepeat}
          className={`p-3 rounded-full transition ${repeat ? 'bg-[#ED0068]' : 'bg-white/10 backdrop-blur-sm'}`}
        >
          <FaRedoAlt />
        </button>
      </div>
    </motion.div>
  )
}
