"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import NotionInterface from './NotionInterface';
import HeroLeft from './HeroLeft';
// import HARNEETPreloader from './HARNEETPreloader';

interface NotionHeroProps {
  onFullScreenView: (type: 'architecture' | 'caseStudy' | 'demo', title: string) => void;
}

const NotionHero: React.FC<NotionHeroProps> = ({ onFullScreenView }) => {
  // Removed unused preloader state variables
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const panelRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Monitor zoom level to adjust nudge position
  useEffect(() => {
    const updateZoom = () => {
      const zoom = Math.round(window.devicePixelRatio * 100);
      setZoomLevel(zoom);
    };
    
    updateZoom();
    window.addEventListener('resize', updateZoom);
    
    // Also listen for zoom events
    const handleZoom = () => {
      setTimeout(updateZoom, 100); // Small delay to ensure zoom is applied
    };
    
    window.addEventListener('wheel', handleZoom);
    
    return () => {
      window.removeEventListener('resize', updateZoom);
      window.removeEventListener('wheel', handleZoom);
    };
  }, []);

  // Handle preloader completion
  // const handlePreloaderComplete = () => {
  //   setShowPreloader(false);
  // };

  // Mouse movement for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x: (x - 0.5) * 2, y: (y - 0.5) * 2 });
    };

    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener('mousemove', handleMouseMove);
      return () => panel.removeEventListener('mousemove', handleMouseMove);
    }
  }, [prefersReducedMotion]);

  // Dynamic nudge positioning based on zoom level
  const getNudgePosition = () => {
    if (zoomLevel <= 67) {
      return 'left-1/2'; // Center position for 67% and below - safe middle zone
    } else if (zoomLevel <= 80) {
      return 'left-2/5'; // Slightly left of center for 68-80% - still safe
    } else if (zoomLevel <= 100) {
      return 'left-1/3'; // Move to safe left position for 81-100%
    } else if (zoomLevel <= 125) {
      return 'left-1/4'; // Further left but not too far for 101-125%
    } else {
      return 'left-1/5'; // Furthest left but still in safe zone for 126%+
    }
  };

  // Show preloader if not completed
  // if (showPreloader) {
  //   return <HARNEETPreloader onComplete={handlePreloaderComplete} />;
  // }

  return (
    <motion.div 
      className="relative w-full h-screen bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient Background Elements - Using viewport units for zoom safety */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-[4vw] h-[4vw] bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ 
            top: 'clamp(15vh, 20vh, 25vh)',
            left: 'clamp(8vw, 10vw, 12vw)'
          }}
        />
        <div 
          className="absolute w-[8vw] h-[8vw] bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ 
            bottom: 'clamp(15vh, 20vh, 25vh)',
            right: 'clamp(8vw, 10vw, 12vw)',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Center Interaction Hint - Dynamic positioning based on zoom level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className={`absolute top-1/2 ${getNudgePosition()} transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:block`}
        style={{ 
          maxWidth: 'clamp(120px, 15vw, 200px)',
          maxHeight: 'clamp(60px, 8vh, 100px)'
        }}
        aria-label="Nudge: slide right to view product brain"
      >
        {/* Compact Mouse Icon with Caption */}
        <motion.div
          className="flex flex-col items-center space-y-2"
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
            style={{ fontSize: 'clamp(12px, 1vw, 14px)' }}
          >
            <span className="hidden lg:inline">peek into my product brain →</span>
            <span className="lg:hidden">peek into my product brain ↓</span>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Main Content Layout - Explicit two-column template with fractional growth */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,560px)_minmax(0,1.25fr)] h-full w-full items-start lg:items-center gap-6 lg:gap-8 lg:gap-10 pt-20 lg:pt-0">
        {/* Left Column - Hero Content (fixed width) */}
        <div className="max-w-[560px] flex items-center justify-center lg:justify-start order-1 lg:order-1 relative z-10 p-4 lg:pr-8 min-h-[45vh] lg:min-h-0">
          <div className="w-full max-w-full">
            <HeroLeft />
          </div>
        </div>

        {/* Mobile Nudge - Between HeroLeft and Notion Interface */}
        <div className="lg:hidden flex justify-center items-center order-2 lg:order-none py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col items-center space-y-2"
            style={{ maxWidth: 'clamp(150px, 50vw, 200px)' }}
          >
            {/* Mouse Icon SVG for Mobile */}
            <svg
              width="clamp(20px, 5vw, 24px)"
              height="clamp(20px, 5vw, 24px)"
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
            <p 
              className="text-white/95 font-mono font-medium tracking-wide text-center"
              style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}
            >
              peek into my product brain ↓
            </p>
          </motion.div>
        </div>

        {/* Right Column - Notion Interface (25% wider with fractional growth) */}
        <div className="w-full justify-self-end flex items-center justify-center lg:justify-end order-3 lg:order-2 relative p-4 lg:pl-0 lg:pr-0 min-h-[55vh] lg:min-h-0">
          {/* Radial Glow Background - Zoom-safe sizing */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl"
              style={{ 
                width: 'clamp(200px, 25vw, 400px)',
                height: 'clamp(200px, 25vw, 400px)'
              }}
            />
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
            className="w-full h-full relative z-10 flex justify-center lg:justify-end"
            data-notion-section
          >
            {/* Scale target container - keeps left edge pinned, growth goes to the right */}
            <div className="relative w-full h-full lg:origin-left lg:transform-gpu lg:[transform:scaleX(1.1)] lg:overflow-hidden">
              <div className="w-full h-full lg:pr-0">
                <NotionInterface onFullScreenView={onFullScreenView} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotionHero; 