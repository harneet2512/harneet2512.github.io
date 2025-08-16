import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroPhrases } from '@/lib/constants';

// Custom CSS keyframes for hue drift effect
const hueDriftKeyframes = `
  @keyframes hueDrift {
    0% { filter: hue-rotate(0deg); }
    25% { filter: hue-rotate(90deg); }
    50% { filter: hue-rotate(180deg); }
    75% { filter: hue-rotate(270deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;

const HeroLeft: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [prefersReducedMotion] = useState(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const handleContactClick = () => {
    // Smooth scroll to contact
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{hueDriftKeyframes}</style>
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 min-w-0" style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
        {/* Artistic accent: 2px vertical gradient rule with slow hue drift */}
        <div 
          className="hidden lg:block absolute top-1/2 -translate-y-1/2 w-0.5 bg-gradient-to-b from-white/30 via-white/10 to-transparent opacity-60" 
          style={{ 
            left: 'clamp(-1rem, -4vw, -1.5rem)',
            height: 'clamp(6rem, 15vh, 8rem)',
            animation: prefersReducedMotion ? 'none' : 'hueDrift 14s infinite linear'
          }}
        />
        
        <div className="text-white text-center lg:text-left relative max-w-2xl min-w-0 px-4 sm:px-6 lg:px-8" style={{ 
          padding: 'clamp(1rem, 4vw, 2rem)',
          maxWidth: 'min(90vw, 32rem)'
        }}>
          {/* Main heading with gradient text */}
          <motion.h1 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-extrabold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent lg:tracking-[-0.01em] leading-tight"
            style={{ 
              fontSize: 'clamp(2rem, 8vw, 4.5rem)',
              lineHeight: '1.1'
            }}
          >
            <span className="break-words">Harneet Bali</span>
          </motion.h1>
          
          {/* Subhead and rotating phrase container */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mt-6"
            style={{ marginTop: 'clamp(1.5rem, 4vw, 2rem)' }}
          >
            {/* Static subhead */}
            <span className="text-white/70 tracking-wide" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>Product Manager</span>
            
            {/* Desktop: inline separator and rotating phrase */}
            <span className="hidden sm:inline text-white/70 tracking-wide" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>{" • "}</span>
            
            {/* Rotating phrase - desktop inline, mobile on new line */}
            <div className="block sm:inline">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPhraseIndex}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                  animate={{ opacity: 1, y: prefersReducedMotion ? 0 : 6 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                  transition={{ 
                    duration: prefersReducedMotion ? 0.2 : 0.32,
                    ease: "easeInOut"
                  }}
                  className="text-white/80 tracking-wide"
                  style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
                >
                  <span className="break-words">{heroPhrases[currentPhraseIndex]}</span>
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="mt-6 leading-relaxed text-white/70 max-w-full break-words"
            style={{ 
              marginTop: 'clamp(1.5rem, 4vw, 2rem)',
              fontSize: 'clamp(1rem, 3vw, 1.125rem)',
              lineHeight: '1.6'
            }}
          >
            I design products and intelligent systems that scale reliably and deliver measurable impact.
          </motion.p>
          
          {/* Let's Connect Button - Similar to About Me section */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.36 }}
            className="mt-6"
            style={{ marginTop: 'clamp(1.5rem, 4vw, 2rem)' }}
          >
            <button 
              onClick={handleContactClick}
              className="group flex items-center text-white/80 font-mono font-medium hover:text-white transition-all duration-300"
              style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                gap: 'clamp(0.75rem, 2vw, 1rem)'
              }}
            >
              <span className="truncate">→ Let's Connect</span>
              <div className="group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" style={{ 
                width: 'clamp(1rem, 3vw, 1.25rem)',
                height: 'clamp(1rem, 3vw, 1.25rem)'
              }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HeroLeft;
