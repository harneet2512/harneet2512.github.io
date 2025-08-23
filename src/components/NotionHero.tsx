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
  const panelRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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



      {/* Main Content Layout - Explicit two-column template with fractional growth */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,560px)_minmax(0,1.25fr)] h-full w-full items-start lg:items-center gap-6 lg:gap-8 lg:gap-10 pt-20 lg:pt-0">
        {/* Left Column - Hero Content (fixed width) */}
        <div className="max-w-[560px] flex items-center justify-center lg:justify-start order-1 lg:order-1 relative z-10 p-4 lg:pr-8 min-h-[45vh] lg:min-h-0">
          <div className="w-full max-w-full">
            <HeroLeft />
          </div>
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