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


// your local tracks
const localTracks = [
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
    author: 'Slushii, Sapientdream, & Rameses B',
    file: '/Multo.mp3',
    thumbnail: '/thumbnails/2.jpg'
  },
  {
    id: 'cant_stop',
    title: 'Groove Control',
    author: 'Infraction',
    file: "/Can't_Stop_The_Feeling.mp3",
    thumbnail: '/thumbnails/3.jpg'
  },
  {
    id: 'you_be_in_my_heart',
    title: "On The Top",
    author: 'Chillpeach',
    file: "/You'd_Be_In_My_Heart.mp3",
    thumbnail: '/thumbnails/4.jpg'
  }
]

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [apiTracks, setApiTracks] = useState([])
  const [combined, setCombined] = useState(localTracks)

  // fetch API once
  useEffect(() => {
    fetch('https://itunes.apple.com/search?term=pop&entity=song&limit=4')
      .then(res => res.json())
      .then(data => {
        const hits = data.results.map(item => ({
          id: 'api-' + item.trackId,
          title: item.trackName,
          author: item.artistName,
          file: item.previewUrl,
          thumbnail: item.artworkUrl100
        }))
        setApiTracks(hits)
      })
      .catch(() => setApiTracks([]))
  }, [])

  // whenever apiTracks load, merge with local
  useEffect(() => {
    setCombined([...localTracks, ...apiTracks])
  }, [apiTracks])

  // find the track object by id param
  const track = combined.find(t => t.id === id) || combined[0]

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [elapsed, setElapsed] = useState('0:00')
  const [duration, setDuration] = useState('0:00')

  // reset when id changes
  useEffect(() => {
    const el = audioRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
      setProgress(0)
      setElapsed('0:00')
      setDuration('0:00')
      if (isPlaying) el.play()
    }
  }, [id])

  const onTimeUpdate = () => {
    const el = audioRef.current
    if (!el) return
    setProgress(el.currentTime / el.duration || 0)
    const fmt = sec => {
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return `${m}:${s < 10 ? '0' : ''}${s}`
    }
    setElapsed(fmt(el.currentTime))
    setDuration(fmt(el.duration || 0))
  }

  const togglePlay = () => {
    const el = audioRef.current
    if (!isPlaying) el.play()
    else el.pause()
    setIsPlaying(p => !p)
  }
  const skipForward = () => {
    const el = audioRef.current
    el.currentTime = Math.min(el.duration, el.currentTime + 10)
  }
  const skipBackward = () => {
    const el = audioRef.current
    el.currentTime = Math.max(0, el.currentTime - 10)
  }
  const toggleShuffle = () => setShuffle(s => !s)
  const toggleRepeat = () => {
    setRepeat(r => !r)
    audioRef.current.loop = !repeat
  }
  const onSeek = e => {
    const val = parseFloat(e.target.value)
    const el = audioRef.current
    el.currentTime = val * el.duration
    setProgress(val)
  }
  const playNext = () => {
    const list = combined
    let next
    if (shuffle) next = list[Math.floor(Math.random() * list.length)]
    else {
      const idx = list.findIndex(t => t.id === track.id)
      next = list[(idx + 1) % list.length]
    }
    navigate(`/player/${next.id}`)
    setIsPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pb-24 px-4 pt-6 bg-gradient-to-b from-black to-blue-900 text-white min-h-screen flex flex-col items-center"
    >
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 text-xl p-2 rounded-full bg-white/10 backdrop-blur-sm"
      >
        <FaArrowLeft />
      </button>

      <div className="w-64 h-64 mt-24 rounded-2xl overflow-hidden mb-6 shadow-xl bg-white/10 backdrop-blur-sm">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-2xl font-semibold mb-1 text-center">{track.title}</h3>
      <p className="text-sm text-center text-white/70 mb-4">{track.author}</p>

      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={onTimeUpdate}
        onEnded={playNext}
      />

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

      <div className="flex items-center justify-between w-full px-6 space-x-4">
        <button
          onClick={toggleShuffle}
          className={`p-3 rounded-full ${shuffle ? 'bg-[#ED0068]' : 'bg-white/10 backdrop-blur-sm'}`}
        >
          <FaRandom />
        </button>
        <button onClick={skipBackward} className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
          <FaBackward />
        </button>
        <button
          onClick={togglePlay}
          className="p-5 bg-gradient-to-r from-[#ED0068] to-[#D84278] rounded-full shadow-lg hover:scale-110 transform"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={skipForward} className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
          <FaForward />
        </button>
        <button
          onClick={toggleRepeat}
          className={`p-3 rounded-full ${repeat ? 'bg-[#ED0068]' : 'bg-white/10 backdrop-blur-sm'}`}
        >
          <FaRedoAlt />
        </button>
      </div>
    </motion.div>
  )
}
