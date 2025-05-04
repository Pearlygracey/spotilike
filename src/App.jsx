import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import ProfilePage from './pages/ProfilePage'
import Library from './pages/Library'
import Player from './pages/Player'
import BottomNav from './components/BottomNav'
import NowPlayingBar from './components/NowPlayingBar'

export default function App() {
  return (
    <div className="min-h-screen pb-32 bg-gradient-to-b from-black to-blue-900 text-white">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/player/:id" element={<Player />} />
      </Routes>
      <NowPlayingBar />
      <BottomNav />
    </div>
  )
}
