// src/pages/Player.jsx
import React, { useEffect, useState } from 'react'
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
import { useAudioPlayer } from '../context/AudioPlayerContext'

// your local tracks
const localTracks = [
  { id: 'karera', title: 'Early Morning', author: 'Infraction', file: '/Karera.mp3', thumbnail: '/thumbnails/1.jpg' },
  { id: 'multo', title: 'Break My Heart (Rameses B Remix)', author: 'Slushii…', file: '/Multo.mp3', thumbnail: '/thumbnails/2.jpg' },
  { id: 'cant_stop', title: 'Groove Control', author: 'Infraction', file: "/Can't_Stop_The_Feeling.mp3", thumbnail: '/thumbnails/3.jpg' },
  { id: 'you_be_in_my_heart', title: 'On The Top', author: 'Chillpeach', file: "/You'd_Be_In_My_Heart.mp3", thumbnail: '/thumbnails/4.jpg' }
]

export default function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentTrack, isPlaying, progress, playTrack, togglePlay, seek, audioRef } = useAudioPlayer()

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

  // merge local + api
  useEffect(() => {
    setCombined([...localTracks, ...apiTracks])
  }, [apiTracks])

  // find the requested track and tell context to play it
  const track = combined.find(t => t.id === id) || combined[0]
  useEffect(() => {
    if (track) playTrack(track)
  }, [id, track])

  // derive elapsed + duration from the shared audioRef
  const [elapsed, setElapsed] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  useEffect(() => {
    const audio = audioRef.current
    function update() {
      const fmt = s => {
        const m = Math.floor(s / 60), sec = Math.floor(s % 60)
        return `${m}:${sec < 10 ? '0' : ''}${sec}`
      }
      setElapsed(fmt(audio.currentTime))
      setDuration(fmt(audio.duration || 0))
    }
    audio.addEventListener('timeupdate', update)
    return () => audio.removeEventListener('timeupdate', update)
  }, [audioRef])

  const skipForward = () => { const a = audioRef.current; a.currentTime = Math.min(a.duration, a.currentTime + 10) }
  const skipBackward = () => { const a = audioRef.current; a.currentTime = Math.max(0, a.currentTime - 10) }

  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const toggleShuffle = () => setShuffle(s => !s)
  const toggleRepeat = () => {
    setRepeat(r => !r)
    audioRef.current.loop = !repeat
  }

  const playNext = () => {
    let next
    if (shuffle) next = combined[Math.floor(Math.random() * combined.length)]
    else {
      const idx = combined.findIndex(t => t.id === track.id)
      next = combined[(idx + 1) % combined.length]
    }
    navigate(`/player/${next.id}`)
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black to-blue-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center pt-6 pb-12 px-4 h-full"
      >
        <button
          onClick={() => navigate(-1)}
          className="self-start mb-4 text-xl p-2 rounded-full bg-white/10 backdrop-blur-sm"
        >
          <FaArrowLeft />
        </button>

        {/* Centered thumbnail card */}
        <div className="w-64 h-64 rounded-2xl mt-16 overflow-hidden mb-6 shadow-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <img src={track.thumbnail} alt={track.title} className="object-cover w-full h-full" />
        </div>

        <h3 className="text-2xl font-semibold mb-1 text-center">{track.title}</h3>
        <p className="text-sm text-center text-white/70 mb-4">{track.author}</p>

        {/* Controls */}
        <div className="w-full max-w-md">
          <div className="flex items-center text-xs font-mono text-white/70 mb-4">
            <span>{elapsed}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              onChange={e => seek(parseFloat(e.target.value))}
              className="mx-2 flex-1 h-1 bg-gray-600 rounded-lg"
            />
            <span>{duration}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <button onClick={toggleShuffle}
              className={`p-3 rounded-full ${shuffle ? 'bg-[#ED0068]' : 'bg-white/10 backdrop-blur-sm'}`}>
              <FaRandom />
            </button>
            <button onClick={skipBackward} className="p-3 bg-white/10 backdrop-blur-sm rounded-full"><FaBackward /></button>
            <button onClick={togglePlay}
              className="p-5 bg-gradient-to-r from-[#ED0068] to-[#D84278] rounded-full shadow-lg transform hover:scale-110">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={skipForward} className="p-3 bg-white/10 backdrop-blur-sm rounded-full"><FaForward /></button>
            <button onClick={toggleRepeat}
              className={`p-3 rounded-full ${repeat ? 'bg-[#ED0068]' : 'bg-white/10 backdrop-blur-sm'}`}>
              <FaRedoAlt />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
