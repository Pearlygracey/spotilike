// src/pages/ProfilePage.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSearch, FaPlay } from 'react-icons/fa'

const tracks = [
  { id: 'karera', title: 'Karera', file: '/Karera.mp3' },
  { id: 'multo', title: 'Multo', file: '/Multo.mp3' },
  { id: 'cant_stop', title: "Can't Stop The Feeling", file: "/Can't_Stop_The_Feeling.mp3" },
  { id: 'you_be_in_my_heart', title: "You'd Be In My Heart", file: "/You'd_Be_In_My_Heart.mp3" },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
}
const itemFade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

export default function ProfilePage() {
  const navigate = useNavigate()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-24 px-4 pt-6 bg-gradient-to-b from-black to-blue-900 text-white min-h-screen"
    >
      {/* Greeting */}
      <motion.h1 variants={itemFade} className="text-3xl font-bold mb-4">
        Hello,{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#D84278]">
          ngani
        </span>
      </motion.h1>

      {/* Search Bar */}
      <motion.div variants={itemFade} className="w-full max-w-md mb-8 relative mx-auto">
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/70" />
        <input
          type="text"
          placeholder="Search music..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
      </motion.div>

      {/* Popular Songs */}
      <motion.div variants={itemFade} className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Popular Songs</h2>
        <div className="flex flex-wrap gap-4">
          {tracks.map(t => (
            <Link key={t.id} to={`/player/${t.id}`}>
              <motion.div
                variants={itemFade}
                whileHover={{ scale: 1.05 }}
                className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
            <img
                src={`/thumbnails/${t.id}.png`}
                onError={e => {
                    // only run once
                    if (!e.currentTarget.dataset.fallback) {
                    e.currentTarget.dataset.fallback = "true"
                    e.currentTarget.src = `/thumbnails/${t.id}.jpeg`
                    }
                }}
                alt={t.title}
                className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <FaPlay className="text-2xl text-white" />
                </div>
                <p className="absolute bottom-2 left-2 text-sm font-medium bg-black/50 px-2 py-1 rounded">
                  {t.title}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Top Albums (horizontal scroll) */}
      <motion.div variants={itemFade} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#D84278]">
          Top Albums
        </h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {tracks.map(t => (
            <Link key={t.id} to={`/player/${t.id}`} className="flex-shrink-0">
              <motion.div
                variants={itemFade}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center w-24"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-1">
                <img
                    src={`/thumbnails/${t.id}.png`}
                    onError={e => {
                        // only run once
                        if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = "true"
                        e.currentTarget.src = `/thumbnails/${t.id}.jpeg`
                        }
                    }}
                    alt={t.title}
                    className="object-cover w-full h-full"
                    />
                </div>
                <p className="text-xs text-center">{t.title}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recently Played */}
      <motion.div variants={itemFade} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#D84278]">
          Recently Played
        </h2>
        <div className="space-y-3">
          {tracks.map(t => (
            <motion.div
              key={t.id}
              variants={itemFade}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              className="flex items-center p-3 bg-white/5 backdrop-blur-sm rounded-xl transition"
            >
              <Link to={`/player/${t.id}`} className="flex items-center flex-1">
                <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                <img
                    src={`/thumbnails/${t.id}.png`}
                    onError={e => {
                        // only run once
                        if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = "true"
                        e.currentTarget.src = `/thumbnails/${t.id}.jpeg`
                        }
                    }}
                    alt={t.title}
                    className="object-cover w-full h-full"
                    />

                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                </div>
              </Link>
              <button
                onClick={() => navigate(`/player/${t.id}`)}
                className="p-2 bg-gradient-to-r from-[#ED0068] to-[#D84278] rounded-full"
              >
                <FaPlay className="text-white text-sm" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
