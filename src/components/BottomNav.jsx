import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineHome, AiOutlineAppstore } from 'react-icons/ai'
import { FaPlayCircle } from 'react-icons/fa'

export default function BottomNav() {
  const { pathname } = useLocation()

  const tabs = [
    { to: '/profile-page', icon: <AiOutlineHome />, label: 'Home' },
    { to: '/library', icon: <AiOutlineAppstore />, label: 'Library' },
    // for Player, we point to a “default” or last-played track; change `karera` as needed
    { to: '/player/karera', icon: <FaPlayCircle />, label: 'Player' },
  ]

  return (
    <nav className="fixed bottom-4 inset-x-4 h-16 bg-blue-950/80 backdrop-blur-lg border border-white/20 rounded-xl flex justify-around items-center z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.to
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={
              'flex flex-col items-center justify-center text-sm transition ' +
              (isActive
                ? 'text-white'
                : 'text-white/60 hover:text-white')
            }
          >
            <div
              className={
                'text-2xl transition-transform ' +
                (isActive ? 'scale-110' : 'scale-100')
              }
            >
              {tab.icon}
            </div>
            <span className="mt-1">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
