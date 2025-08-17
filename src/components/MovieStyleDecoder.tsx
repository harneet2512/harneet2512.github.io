import { useState, useEffect, useRef } from "react";

// Phrases that will be decoded
const DECODE_PHRASES = [
  "PROBLEM SOLVER",
  "CODE ARCHITECT", 
  "CREATIVE MIND",
  "UI UX DESIGNER",
  "FULL STACK DEV",
  "DIGITAL INNOVATOR"
];

// Characters for the hacking effect
const HACK_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

interface LetterProps {
  char: string;
  phraseIndex: number;
  letterIndex: number;
  isVisible: boolean;
  isDropping: boolean;
  isDecoding: boolean;
  isComplete: boolean;
  onDropComplete: () => void;
  onDecodeComplete: () => void;
}

function Letter({ 
  char, 
  phraseIndex, 
  letterIndex, 
  isVisible, 
  isDropping, 
  isDecoding, 
  isComplete, 
  onDropComplete, 
  onDecodeComplete 
}: LetterProps) {
  const [currentChar, setCurrentChar] = useState(char);
  const [isGlowing, setIsGlowing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'drop' | 'snap' | 'decode' | 'complete'>('drop');
  const decodeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const decodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Drop animation with Disney bounce physics
  useEffect(() => {
    if (isDropping) {
      const dropDelay = phraseIndex * 200 + letterIndex * 50; // Staggered drop
      
      // Phase 1: Drop with bounce
      dropTimeoutRef.current = setTimeout(() => {
        setAnimationPhase('snap');
        onDropComplete();
      }, dropDelay + 600); // Drop duration
    }
  }, [isDropping, phraseIndex, letterIndex, onDropComplete]);

  // Magnetic snap effect
  useEffect(() => {
    if (animationPhase === 'snap') {
      snapTimeoutRef.current = setTimeout(() => {
        setAnimationPhase('decode');
      }, 300); // Snap duration
    }
  }, [animationPhase]);

  // Decoding animation with Matrix-style effects
  useEffect(() => {
    if (isDecoding && !isComplete && animationPhase === 'decode') {
      setIsGlowing(true);
      let decodeCount = 0;
      const maxDecodes = 10 + Math.random() * 6; // More random decode cycles
      
      decodeIntervalRef.current = setInterval(() => {
        setCurrentChar(HACK_CHARS[Math.floor(Math.random() * HACK_CHARS.length)]);
        decodeCount++;
        
        if (decodeCount >= maxDecodes) {
          clearInterval(decodeIntervalRef.current!);
          setCurrentChar(char); // Final correct character
          setIsGlowing(false);
          setAnimationPhase('complete');
          
          // Small delay before marking complete
          decodeTimeoutRef.current = setTimeout(() => {
            onDecodeComplete();
          }, 300);
        }
      }, 60 + Math.random() * 40); // Faster, more random decode speed
    }
  }, [isDecoding, isComplete, char, onDecodeComplete, animationPhase]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (decodeIntervalRef.current) clearInterval(decodeIntervalRef.current);
      if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current);
      if (decodeTimeoutRef.current) clearTimeout(decodeTimeoutRef.current);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`
        inline-block mx-1 transition-all duration-500 ease-out
        ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-[-200px] opacity-0 scale-75'
        }
        ${isDropping ? 'animate-letter-drop' : ''}
        ${animationPhase === 'snap' ? 'animate-magnetic-snap' : ''}
        ${isGlowing ? 'animate-matrix-glow' : ''}
        ${animationPhase === 'complete' ? 'animate-hacking-decode' : ''}
      `}
      style={{
        transitionDelay: `${phraseIndex * 200 + letterIndex * 50}ms`
      }}
    >
      <div className={`
        relative bg-black border rounded-md px-2 py-1
        text-white font-mono text-sm md:text-base font-bold
        transition-all duration-200 ease-out
        min-w-[2rem] h-8 md:h-10 flex items-center justify-center
        letter-block
        ${isGlowing 
          ? 'decoding-active animate-matrix-glow' 
          : isComplete 
            ? 'completed-letter' 
            : 'border-gray-600 bg-gray-800/30'
        }
        ${isDropping ? 'scale-110' : isComplete ? 'scale-100' : 'scale-95'}
      `}>
        <span className={`
          transition-all duration-100
          ${isGlowing ? 'text-green-400' : 'text-white'}
        `}>
          {currentChar === ' ' ? '\u00A0' : currentChar}
        </span>
        
        {/* Enhanced glow effect during decoding */}
        {isGlowing && (
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-400/20 animate-pulse pointer-events-none"></div>
        )}
        
        {/* Matrix-style scan line effect */}
        {isGlowing && (
          <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
            <div className="w-full h-0.5 bg-green-400/60 scan-line"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MovieStyleDecoder() {
  const [visiblePhrases, setVisiblePhrases] = useState(0);
  const [droppedLetters, setDroppedLetters] = useState<Set<string>>(new Set());
  const [decodingLetters, setDecodingLetters] = useState<Set<string>>(new Set());
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Start animation cycle
  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setVisiblePhrases(0);
    setDroppedLetters(new Set());
    setDecodingLetters(new Set());
    setCompletedLetters(new Set());

    // Phase 1: Drop phrases one by one
    const dropPhrases = () => {
      let phraseIndex = 0;
      const dropInterval = setInterval(() => {
        if (phraseIndex < DECODE_PHRASES.length) {
          setVisiblePhrases(phraseIndex + 1);
          phraseIndex++;
        } else {
          clearInterval(dropInterval);
          // Start decoding after all phrases are visible
          setTimeout(startDecoding, 1200);
        }
      }, 700);
    };

    // Phase 2: Start decoding letters with staggered timing
    const startDecoding = () => {
      let letterIndex = 0;
      const totalLetters = DECODE_PHRASES.reduce((sum, phrase) => sum + phrase.length, 0);
      
      const decodeInterval = setInterval(() => {
        if (letterIndex < totalLetters) {
          // Find which phrase and letter this corresponds to
          let currentLetterIndex = letterIndex;
          let phraseIndex = 0;
          
          for (let i = 0; i < DECODE_PHRASES.length; i++) {
            if (currentLetterIndex < DECODE_PHRASES[i].length) {
              phraseIndex = i;
              break;
            }
            currentLetterIndex -= DECODE_PHRASES[i].length;
          }
          
          const letterKey = `${phraseIndex}-${currentLetterIndex}`;
          setDroppedLetters(prev => new Set([...prev, letterKey]));
          
          // Start decoding after a short delay
          setTimeout(() => {
            setDecodingLetters(prev => new Set([...prev, letterKey]));
          }, 400);
          
          letterIndex++;
        } else {
          clearInterval(decodeInterval);
          // Animation complete
          setTimeout(() => {
            setIsAnimating(false);
          }, 2500);
        }
      }, 120); // Faster letter processing
    };

    dropPhrases();
  };

  // Handle letter drop completion
  const handleDropComplete = (phraseIndex: number, letterIndex: number) => {
    const letterKey = `${phraseIndex}-${letterIndex}`;
    setDroppedLetters(prev => new Set([...prev, letterKey]));
  };

  // Handle letter decode completion
  const handleDecodeComplete = (phraseIndex: number, letterIndex: number) => {
    const letterKey = `${phraseIndex}-${letterIndex}`;
    setDecodingLetters(prev => {
      const newSet = new Set(prev);
      newSet.delete(letterKey);
      return newSet;
    });
    setCompletedLetters(prev => new Set([...prev, letterKey]));
  };

  // Start animation on mount
  useEffect(() => {
    const timer = setTimeout(startAnimation, 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-restart animation
  useEffect(() => {
    if (!isAnimating) {
      animationTimeoutRef.current = setTimeout(startAnimation, 4000);
    }
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isAnimating]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      {/* Section Label */}
      <div className="text-center mb-8">
        <span className="text-gray-500 font-mono text-sm tracking-wider uppercase">
          // Decoding Identity
        </span>
      </div>
      
      {/* Phrases Container */}
      <div className="space-y-4 md:space-y-6 max-w-2xl">
        {DECODE_PHRASES.map((phrase, phraseIndex) => (
          <div 
            key={phraseIndex}
            className={`
              flex flex-wrap justify-center transition-all duration-500
              ${phraseIndex < visiblePhrases ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {phrase.split('').map((char, letterIndex) => {
              const letterKey = `${phraseIndex}-${letterIndex}`;
              const isVisible = phraseIndex < visiblePhrases;
              const isDropping = isVisible && !droppedLetters.has(letterKey);
              const isDecoding = decodingLetters.has(letterKey);
              const isComplete = completedLetters.has(letterKey);
              
              return (
                <Letter
                  key={letterKey}
                  char={char}
                  phraseIndex={phraseIndex}
                  letterIndex={letterIndex}
                  isVisible={isVisible}
                  isDropping={isDropping}
                  isDecoding={isDecoding}
                  isComplete={isComplete}
                  onDropComplete={() => handleDropComplete(phraseIndex, letterIndex)}
                  onDecodeComplete={() => handleDecodeComplete(phraseIndex, letterIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Enhanced Status Indicator */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-green-400 animate-status-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-gray-400 font-mono text-xs">
            {isAnimating ? 'DECODING...' : 'READY'}
          </span>
        </div>
      </div>
    </div>
  );
} 