// src/pages/Library.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPlay, FaPause, FaSearch } from 'react-icons/fa'

const tracks = [
  { id: 'karera', title: 'Karera', file: '/Karera.mp3', thumbnail: '/thumbnails/karera.jpg' },
  { id: 'multo', title: 'Multo', file: '/Multo.mp3', thumbnail: '/thumbnails/multo.jpg' },
  { id: 'cant_stop', title: "Can't Stop The Feeling", file: "/Can't_Stop_The_Feeling.mp3", thumbnail: '/thumbnails/cant_stop.png' },
  { id: 'you_be_in_my_heart', title: "You'd Be In My Heart", file: "/You'd_Be_In_My_Heart.mp3", thumbnail: '/thumbnails/you_be_in_my_heart.png' },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { staggerChildren: 0.1, when: 'beforeChildren' }
  }
}
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
}

export default function Library() {
  const [search, setSearch] = useState('')
  const filtered = tracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen pb-24 px-4 pt-8 bg-gradient-to-b from-black to-blue-900 text-white"
    >
      <h1 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#D84278]">
        Your Library
      </h1>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search songs..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {filtered.map(track => (
          <TrackCard key={track.id} track={track} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-white/50">No results found.</p>
        )}
      </motion.div>
    </motion.div>
  )
}

function TrackCard({ track }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // stop audio when unmount
  useEffect(() => () => {
    if (audioRef.current) audioRef.current.pause()
  }, [])

  const togglePlay = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isPlaying) audioRef.current.play()
    else audioRef.current.pause()
    setIsPlaying(p => !p)
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ translateY: -4 }}
      className="relative rounded-xl overflow-hidden shadow-lg group"
    >
      {/* border gradient */}
      <div className="absolute inset-0 p-[2px] bg-gradient-to-r from-[#ED0068] to-[#D84278] rounded-xl pointer-events-none" />

      {/* card background */}
      <Link
        to={`/player/${track.id}`}
        className="relative z-10 block bg-[#1F1F1F] rounded-lg overflow-hidden"
      >
        <img
          src={track.thumbnail}
          alt={track.title}
          className="object-cover w-full h-32 sm:h-40"
        />
        <div className="p-3">
          <p className="text-sm font-semibold mb-1">{track.title}</p>
        </div>
      </Link>

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="absolute bottom-3 right-3 p-3 bg-gradient-to-r from-[#ED0068] to-[#D84278] rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <audio ref={audioRef} src={track.file} onEnded={() => setIsPlaying(false)} />
    </motion.div>
  )
}
