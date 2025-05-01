import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Homepage() {
  // a simple stagger container
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  // fade-in variant
  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  }

  // slide from left
  const slideLeft = {
    hidden: { x: -100, opacity: 0 },
    show: { x: 0, opacity: 1 }
  }

  // slide from right
  const slideRight = {
    hidden: { x: 100, opacity: 0 },
    show: { x: 0, opacity: 1 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative h-screen flex flex-col justify-center items-start px-10 text-white overflow-hidden"
    >
      {/* Background + overlays */}
      <motion.div
        variants={fadeIn}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-[-2]"
      >
        <img
          src="/pearl.png"
          alt="Musical Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ED0068]/60 to-[#D84278]/60" />
      </motion.div>

      {/* Logo */}
      <motion.div
        variants={fadeIn}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-8 right-10"
      >
        <img src="/logo.jpg" alt="Logo" className="w-24 h-auto drop-shadow-md" />
      </motion.div>

      {/* Content */}
      <div className="z-10 max-w-xl space-y-6">
        <motion.h1
          variants={slideLeft}
          transition={{ type: 'tween', duration: 0.8 }}
          className="text-6xl font-extrabold bg-clip-text pb-2 text-transparent bg-gradient-to-r from-[#ED0068] to-[#D84278]"
        ><div className='bg-gradient-to-r text-shadow-pink-600 from-[#ff0270] to-[#ffc853] bg-clip-text text-transparent'>
          Welcome to Ating Musika, ngani
        </div>
          
        </motion.h1>

        <motion.p
          variants={slideRight}
          transition={{ type: 'tween', duration: 0.8 }}
          className="text-lg font-light"
        >
          Discover the rich and colorful sounds of our heritage.  
          Dive into curated playlists, traditional tunes, and the heart of Filipino music.
        </motion.p>

        <motion.div
          variants={slideLeft}
          transition={{ type: 'tween', duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to='profile-page'>
            <div className="px-1 py-1 w-[200px] rounded-full bg-gradient-to-r from-[#ED0068] to-[#eff546] text-lg font-semibold shadow-lg">
              <div className='px-7 py-2 bg-blue-950 rounded-full text-[#D84278]'>
              Start Streaming
              </div>
            </div>
          </Link>
        </motion.div>
        <motion.div
          variants={slideRight}
          transition={{ type: 'tween', duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/library"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#ED0068] to-[#D84278] text-lg font-semibold shadow-lg"
          >
            Go to Library
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
 