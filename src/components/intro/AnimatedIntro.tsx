import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface AnimatedIntroProps {
  onComplete?: () => void;
}

export function AnimatedIntro({ onComplete }: AnimatedIntroProps) {
  const navigate = useNavigate();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const phrases = [
    "Building with AI",
    "Orchestrating Systems", 
    "Designing with Intent"
  ];

  const terminalCommand = "> entering_alexcook.pm";

  useEffect(() => {
    let typeInterval: NodeJS.Timeout | null = null;
    
    // Start the phrase sequence
    const phraseTimer = setTimeout(() => {
      setCurrentPhraseIndex(1);
    }, 800);

    const phraseTimer2 = setTimeout(() => {
      setCurrentPhraseIndex(2);
    }, 1600);

    const phraseTimer3 = setTimeout(() => {
      setCurrentPhraseIndex(3);
    }, 2400);

    // Show terminal after phrases
    const terminalTimer = setTimeout(() => {
      setShowTerminal(true);
    }, 3200);

    // Start typing terminal command
    const typeTimer = setTimeout(() => {
      let index = 0;
      typeInterval = setInterval(() => {
        if (index < terminalCommand.length) {
          setTerminalText(terminalCommand.slice(0, index + 1));
          index++;
        } else {
          if (typeInterval) {
            clearInterval(typeInterval);
            typeInterval = null;
          }
          // Complete the intro after typing
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              if (onComplete) {
                onComplete();
              } else {
                navigate('/');
              }
            }, 1000);
          }, 800);
        }
      }, 100);
    }, 3400);

    return () => {
      clearTimeout(phraseTimer);
      clearTimeout(phraseTimer2);
      clearTimeout(phraseTimer3);
      clearTimeout(terminalTimer);
      clearTimeout(typeTimer);
      if (typeInterval) {
        clearInterval(typeInterval);
      }
    };
  }, [navigate, onComplete, terminalCommand]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-[#0d0d0d] flex flex-col items-center justify-center z-50 overflow-hidden"
        >
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" />
          
          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
            {/* Phrases container */}
            <div className="relative h-32 mb-16">
              <AnimatePresence mode="wait">
                {currentPhraseIndex > 0 && (
                  <motion.div
                    key="phrase-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-white tracking-tight">
                      {phrases[0]}
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentPhraseIndex > 1 && (
                  <motion.div
                    key="phrase-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-white tracking-tight">
                      {phrases[1]}
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {currentPhraseIndex > 2 && (
                  <motion.div
                    key="phrase-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-white tracking-tight">
                      {phrases[2]}
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Terminal prompt */}
            <AnimatePresence>
              {showTerminal && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="font-mono text-lg md:text-xl text-green-400 tracking-wide"
                >
                  {terminalText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                  >
                    |
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-white/30 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-white/30 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-white/30 rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Additional ambient effects */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 