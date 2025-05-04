import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa'
import { useAudioPlayer } from '../context/AudioPlayerContext'
import { useNavigate } from 'react-router-dom'

// duplicate your localTracks array here:
const localTracks = [
  { id: 'karera', title: 'Early Morning', author: 'Infraction', file: '/Karera.mp3', thumbnail: '/thumbnails/1.jpg' },
  { id: 'multo', title: 'Break My Heart (Rameses B Remix)', author: 'Slushii…', file: '/Multo.mp3', thumbnail: '/thumbnails/2.jpg' },
  { id: 'cant_stop', title: 'Groove Control', author: 'Infraction', file: "/Can't_Stop_The_Feeling.mp3", thumbnail: '/thumbnails/3.jpg' },
  { id: 'you_be_in_my_heart', title: 'On The Top', author: 'Chillpeach', file: "/You'd_Be_In_My_Heart.mp3", thumbnail: '/thumbnails/4.jpg' }
]

export default function NowPlayingBar() {
  const { currentTrack, isPlaying, progress, togglePlay, seek, audioRef } = useAudioPlayer()
  const [apiTracks, setApiTracks] = useState([])
  const [combined, setCombined] = useState(localTracks)
  const navigate = useNavigate()

  // fetch the same API tracks
  useEffect(() => {
    fetch('https://itunes.apple.com/search?term=pop&entity=song&limit=4')
      .then(r => r.json())
      .then(data => {
        const hits = data.results.map(i => ({
          id: 'api-' + i.trackId,
          title: i.trackName,
          author: i.artistName,
          file: i.previewUrl,
          thumbnail: i.artworkUrl100
        }))
        setApiTracks(hits)
      })
      .catch(() => setApiTracks([]))
  }, [])

  // merge
  useEffect(() => {
    setCombined([...localTracks, ...apiTracks])
  }, [apiTracks])

  if (!currentTrack) return null

  // find index for prev/next
  const idx = combined.findIndex(t => t.id === currentTrack.id)
  const prev = combined[(idx - 1 + combined.length) % combined.length]
  const next = combined[(idx + 1) % combined.length]

  const onPrev = () => { navigate(`/player/${prev.id}`) }
  const onNext = () => { navigate(`/player/${next.id}`) }

  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }}
      className="fixed bottom-20 inset-x-4 h-16 bg-blue-950/90 backdrop-blur-sm border border-white/20 rounded-xl flex items-center max-w-6xl min-w-2 px-4 z-50"
    >
      {/* Title */}
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-bold truncate">{currentTrack.title}</p>
        {/* mini‑progress */}
        <input
          type="range" min="0" max="1" step="0.001"
          value={progress}
          onChange={e => seek(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 ml-4">
        <button onClick={onPrev} className="p-2 bg-white/10 rounded-full">
          <FaBackward />
        </button>
        <button onClick={togglePlay} className="p-3 bg-gradient-to-r from-[#ED0068] to-[#D84278] rounded-full shadow-lg">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={onNext} className="p-2 bg-white/10 rounded-full">
          <FaForward />
        </button>
      </div>
    </motion.div>
  )
}
