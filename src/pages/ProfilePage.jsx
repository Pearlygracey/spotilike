// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSearch, FaPlay } from 'react-icons/fa'

const localTracks = [
  { id: 'karera', title: 'Early Morning by Infraction', file: '/Karera.mp3', pic: '1' },
  { id: 'multo', title: 'Break My Heart (Rameses B Remix)', file: '/Multo.mp3', pic: '2' },
  { id: 'cant_stop', title: "Groove Control", file: "/Can't_Stop_The_Feeling.mp3", pic: '3' },
  { id: 'you_be_in_my_heart', title: "On The Top", file: "/You'd_Be_In_My_Heart.mp3", pic: '4' },
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
  const [search, setSearch] = useState('')
  const [apiTracks, setApiTracks] = useState([])

  // Fetch “other songs” from iTunes API
  useEffect(() => {
    fetch('https://itunes.apple.com/search?term=pop&entity=song&limit=4')
      .then(res => res.json())
      .then(data => {
        const hits = data.results.map(item => ({
          id: 'api-' + item.trackId,
          title: `${item.trackName} by ${item.artistName}`,
          file: item.previewUrl,
          thumbnail: item.artworkUrl100
        }))
        setApiTracks(hits)
      })
      .catch(() => setApiTracks([]))
  }, [])

  // Combine and filter
  const allTracks = [
    ...localTracks.map(t => ({ ...t, thumbnail: `/thumbnails/${t.pic}.jpg`, isLocal: true })),
    ...apiTracks
  ]
  const filtered = allTracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const localFiltered = filtered.filter(t => t.isLocal)
  const apiFiltered = filtered.filter(t => !t.isLocal)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-24 px-4 pt-6 bg-gradient-to-b from-black to-blue-900 text-white min-h-screen"
    >
      {/* Greeting */}
      <motion.h1 variants={itemFade} className="text-3xl flex gap-2 font-bold mb-4">
        <img src="logo.png" className="w-10" alt="logo" />
        Hello,{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#eecf36]">
          ngani!
        </span>
      </motion.h1>

      {/* Search Bar */}
      <motion.div variants={itemFade} className="w-full max-w-md mb-8 relative mx-auto">
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search music..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
      </motion.div>

      {/* Popular Songs */}
      <motion.div variants={itemFade} className="mb-10">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#feee40]">
          Popular Songs
        </h2>
        <div className="flex flex-wrap gap-4">
          {filtered.map(t => (
            <div key={t.id} className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg relative group">
              {t.isLocal ? (
                <Link to={`/player/${t.id}`} className="block w-full h-full">
                  <img
                    src={t.thumbnail}
                    alt={t.title}
                    className="object-cover w-full h-full"
                    onError={e => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = 'true'
                        e.currentTarget.src = `/thumbnails/${t.id}.jpeg`
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <FaPlay className="text-2xl text-white" />
                  </div>
                  <p className="absolute bottom-2 left-2 text-sm font-medium bg-black/50 px-2 py-1 rounded">
                    {t.title}
                  </p>
                </Link>
              ) : (
                // API preview: play previewUrl
                <div className="block w-full h-full">
                  <img src={t.thumbnail} alt={t.title} className="object-cover w-full h-full"/>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <ApiPlayPreview track={t} />
                  </div>
                  <p className="absolute bottom-2 left-2 text-xs font-medium bg-black/50 px-2 py-1 rounded">
                    {t.title}
                  </p>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-white/50 col-span-full">No songs match “{search}.”</p>
          )}
        </div>
      </motion.div>

      {/* Top Albums */}
      <motion.div variants={itemFade} className="mb-8">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#fbdf41]">
          Top Albums
        </h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {localTracks.map(t => (
            <Link key={t.id} to={`/player/${t.id}`} className="flex-shrink-0">
              <motion.div
                variants={itemFade}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center w-24"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-1">
                  <img
                    src={`/thumbnails/${t.pic}.jpg`}
                    onError={e => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = 'true'
                        e.currentTarget.src = `/thumbnails/${t.pic}.jpeg`
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
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ED0068] to-[#ffd042]">
          Recently Played
        </h2>
        <div className="space-y-3">
          {localTracks.map(t => (
            <div
              key={t.id}
              className="flex items-center p-3 bg-white/5 backdrop-blur-sm rounded-xl transition group"
            >
              <Link to={`/player/${t.id}`} className="flex items-center flex-1">
                <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img
                    src={`/thumbnails/${t.pic}.jpg`}
                    onError={e => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = 'true'
                        e.currentTarget.src = `/thumbnails/${t.id}.jpeg`
                      }
                    }}
                    alt={t.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm font-medium">{t.title}</p>
              </Link>
              <ApiPlayPreview track={t} isButton />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// component to play API or local preview
function ApiPlayPreview({ track, isButton }) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef(null)

  const toggle = () => {
    if (!playing) audio.current.play()
    else audio.current.pause()
    setPlaying(p => !p)
  }

  return (
    <>
      <button
        onClick={toggle}
        className={
          `p-2 rounded-full text-white transition ` +
          (isButton
            ? 'bg-gradient-to-r from-[#ED0068] to-[#D84278]'
            : '')
        }
      >
        <FaPlay />
      </button>
      <audio ref={audio} src={track.file} onEnded={() => setPlaying(false)} />
    </>
  )
}
