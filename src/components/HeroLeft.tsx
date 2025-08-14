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
      <div className="w-full lg:w-[35%] flex items-center justify-center p-4 sm:p-6 lg:p-8 order-3 lg:order-1 relative z-10 min-w-0">
        {/* Artistic accent: 2px vertical gradient rule with slow hue drift */}
        <div 
          className="hidden lg:block absolute -left-6 top-1/2 -translate-y-1/2 w-0.5 h-40 bg-gradient-to-b from-white/30 via-white/10 to-transparent opacity-60" 
          style={{ 
            animation: prefersReducedMotion ? 'none' : 'hueDrift 14s infinite linear'
          }}
        />
        
        <div className="text-white space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-12 text-center lg:text-left relative max-w-xl min-w-0 px-4 sm:px-6">
          {/* Main heading with gradient text */}
          <motion.h1 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent lg:tracking-[-0.01em]"
          >
            Harneet Bali
          </motion.h1>
          
          {/* Subhead and rotating phrase container */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mt-6"
          >
            {/* Static subhead */}
            <span className="text-base sm:text-lg text-white/70 tracking-wide">
              Product Manager
            </span>
            
            {/* Desktop: inline separator and rotating phrase */}
            <span className="hidden sm:inline text-base sm:text-lg text-white/70 tracking-wide">
              {" • "}
            </span>
            
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
                  className="text-base sm:text-lg text-white/80 tracking-wide"
                >
                  {heroPhrases[currentPhraseIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="mt-6 text-base leading-7 text-white/70"
          >
            I design products and intelligent systems that scale reliably and deliver measurable impact.
          </motion.p>
          
          {/* Let's Connect Button - Similar to About Me section */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.36 }}
            className="mt-8"
          >
            <button 
              onClick={handleContactClick}
              className="group flex items-center space-x-3 text-white/80 font-mono text-base md:text-lg font-medium hover:text-white transition-all duration-300"
            >
              <span>→ Let's Connect</span>
              <div className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
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
