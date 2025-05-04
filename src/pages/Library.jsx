// src/pages/Library.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSearch, FaPlay, FaPause } from 'react-icons/fa'

const localTracks = [
  { id: 'karera', title: 'Early Morning by Infraction', file: '/Karera.mp3', thumbnail: '/thumbnails/1.jpg', isLocal: true },
  { id: 'multo', title: 'Break My Heart (Rameses B Remix)', file: '/Multo.mp3', thumbnail: '/thumbnails/2.jpg', isLocal: true },
  { id: 'cant_stop', title: "Groove Control", file: "/Can't_Stop_The_Feeling.mp3", thumbnail: '/thumbnails/3.jpg', isLocal: true },
  { id: 'you_be_in_my_heart', title: "On The Top", file: "/You'd_Be_In_My_Heart.mp3", thumbnail: '/thumbnails/4.jpg', isLocal: true },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
}
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

export default function Library() {
  const [search, setSearch] = useState('')
  const [apiTracks, setApiTracks] = useState([])
  const [currentAudio, setCurrentAudio] = useState(null) // 👈 add this

  // fetch 4 extra songs from iTunes
  useEffect(() => {
    fetch('https://itunes.apple.com/search?term=pop&entity=song&limit=4')
      .then(r => r.json())
      .then(data => {
        const hits = data.results.map(item => ({
          id: 'api-' + item.trackId,
          title: `${item.trackName} — ${item.artistName}`,
          file: item.previewUrl,
          thumbnail: item.artworkUrl100,
          isLocal: false
        }))
        setApiTracks(hits)
      })
      .catch(() => setApiTracks([]))
  }, [])

  const allTracks = [...localTracks, ...apiTracks]
  const filtered = allTracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen pb-24 pt-8 px-4 bg-gradient-to-b from-black to-blue-900 text-white"
    >
      <h1 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#fb943b]">
        Your Playlist
      </h1>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-6">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search songs..."
          className="w-full pl-12 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
      </div>

      {/* Rows */}
      <motion.div className="space-y-4" variants={containerVariants}>
        {filtered.map(track => (
          <TrackRow
            key={track.id}
            track={track}
            currentAudio={currentAudio}         // 👈 pass this
            setCurrentAudio={setCurrentAudio}   // 👈 pass this
          />
        ))}
      </motion.div>

    </motion.div>
  )
}

function TrackRow({ track, currentAudio, setCurrentAudio }) {
  const navigate = useNavigate()
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)


  useEffect(() => {
    if (currentAudio !== audioRef.current) {
      setIsPlaying(false)
    }
  }, [currentAudio])
  
  useEffect(() => () => {
    audioRef.current?.pause()
  }, [])

  const togglePlay = (e) => {
    e.stopPropagation()

    const thisAudio = audioRef.current

    // Pause the current playing audio if it's different
    if (currentAudio && currentAudio !== thisAudio) {
      currentAudio.pause()
    }

    if (!isPlaying) {
      thisAudio.play()
      setCurrentAudio(thisAudio)
    } else {
      thisAudio.pause()
    }

    setIsPlaying(prev => !prev)
  }

  const goToPlayer = () => {
    navigate(`/player/${track.id}`)
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      onClick={goToPlayer}
      className="relative flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl transition cursor-pointer"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ED0068] to-[#D84278]" />

      <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="object-cover w-full h-full"
          onError={e => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = 'true'
              e.currentTarget.src = track.isLocal
                ? `/thumbnails/${track.id}.jpg`
                : ''
            }
          }}
        />
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{track.title}</p>
      </div>

      <button
        onClick={togglePlay}
        className="p-2 bg-gradient-to-r from-[#ED0068] to-[#D84278] rounded-full text-white shadow-lg"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <audio
        ref={audioRef}
        src={track.file}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentAudio(null)
        }}
      />
    </motion.div>
  )
}

