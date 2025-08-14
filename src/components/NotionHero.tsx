"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import HARNEETPreloader from './HARNEETPreloader'
import NotionInterface from './NotionInterface'
import HeroLeft from './HeroLeft'

const NotionHero: React.FC = () => {
  // Debug logging to track component rendering
  useEffect(() => {
    console.log('🎯 NotionHero component mounted at:', new Date().toISOString())
    console.log('🎯 Component instance ID:', Math.random().toString(36).substr(2, 9))
    return () => {
      console.log('🔄 NotionHero component unmounting at:', new Date().toISOString())
    }
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  // Rotating identity line state
  const [currentIdentityIndex, setCurrentIdentityIndex] = useState(0)
  const identityLines = [
    "Problem Solver",
    "Systems Thinker", 
    "Product Architect",
    "Team Catalyst",
    "Future Shaper"
  ]
  
  // Mouse tracking for subtle tilt effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Rotating identity line effect
  useEffect(() => {
    if (prefersReducedMotion) return
    
    const interval = setInterval(() => {
      setCurrentIdentityIndex(prev => (prev + 1) % identityLines.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [prefersReducedMotion, identityLines.length])
  
  // Mouse tracking for subtle tilt effect - optimized with throttling
  useEffect(() => {
    if (prefersReducedMotion) return
    
    let ticking = false
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = e.clientX - centerX
            const deltaY = e.clientY - centerY
            
            setMousePosition({
              x: deltaX / (rect.width / 2),
              y: deltaY / (rect.height / 2)
            })
          }
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [prefersReducedMotion])

  // Handle preloader completion
  const handlePreloaderComplete = useCallback(() => {
    console.log('Preloader completed, showing main content')
    setIsLoading(false)
  }, [])

  // Memoize the NotionInterface to prevent unnecessary re-renders
  const memoizedNotionInterface = useMemo(() => <NotionInterface />, [])

  // Show preloader if loading
  if (isLoading) {
    return <HARNEETPreloader onComplete={handlePreloaderComplete} />
  }



  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Center Interaction Hint - Mobile Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute top-1/2 left-1/2 lg:left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none hidden lg:block"
        aria-label="Nudge: slide right to view product brain"
      >
        {/* Compact Mouse Icon with Caption */}
        <motion.div
          className="flex flex-col items-center gap-2 lg:gap-4"
          animate={prefersReducedMotion ? {} : {
            x: [0, 84, 84, 0]
          }}
          transition={prefersReducedMotion ? {} : {
            x: {
              duration: 3.2,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
              repeatDelay: 0,
              times: [0, 0.28, 0.31, 1]
            }
          }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        >
          {/* Mouse Icon SVG */}
          <svg
            width="clamp(18px, 1.4vw, 28px)"
            height="clamp(18px, 1.4vw, 28px)"
            viewBox="0 0 24 24"
            className="flex-shrink-0"
            style={{
              width: 'clamp(18px, 1.4vw, 28px)',
              height: 'clamp(18px, 1.4vw, 28px)'
            }}
          >
            {/* Mouse Body */}
            <path
              d="M12 2C8.13 2 5 5.13 5 9v6c0 3.87 3.13 7 7 7s7-3.13 7-7V9c0-3.87-3.13-7-7-7z"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            
            {/* Mouse Cable */}
            <path
              d="M12 2v-2"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
          
          {/* Caption Text - Below Icon */}
          <motion.p
            className="text-white/95 font-mono font-medium tracking-wide text-center"
            style={{
              fontSize: 'clamp(12px, 0.95vw, 15px)',
              letterSpacing: '0.02em'
            }}
          >
            <span className="hidden lg:inline">peek into my product brain →</span>
            <span className="lg:hidden">peek into my product brain ↓</span>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Mobile Nudge - Only visible on mobile */}
      <div className="lg:hidden flex justify-center py-6 order-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col items-center gap-2"
        >
          {/* Mouse Icon SVG for Mobile */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="flex-shrink-0"
          >
            {/* Mouse Body */}
            <path
              d="M12 2C8.13 2 5 5.13 5 9v6c0 3.87 3.13 7 7 7s7-3.13 7-7V9c0-3.87-3.13-7-7-7z"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            
            {/* Mouse Cable */}
            <path
              d="M12 2v-2"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
          
          {/* Caption Text for Mobile */}
          <p className="text-white/95 font-mono font-medium tracking-wide text-center text-sm">
            peek into my product brain ↓
          </p>
        </motion.div>
      </div>

      {/* Left Column - 35% */}
      <HeroLeft />

      {/* Right Column - 65% - Full Notion Interface */}
      <div className="w-full lg:w-[65%] flex items-center justify-center lg:justify-end p-2 sm:p-4 lg:p-8 order-1 lg:order-2">
        {/* Radial Glow Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-gradient-radial from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        <motion.div 
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            transform: prefersReducedMotion ? 'none' : `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
            willChange: prefersReducedMotion ? 'auto' : 'transform'
          }}
          className="w-full max-w-[1400px] relative z-10 flex justify-center lg:justify-end"
          data-notion-section
        >
          {memoizedNotionInterface}
        </motion.div>
      </div>
    </div>
  )
}

export default NotionHero 