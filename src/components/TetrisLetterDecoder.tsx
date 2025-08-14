import { useState, useEffect, useRef } from "react";

// Phrases that will be built letter by letter
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

interface LetterState {
  char: string;
  phraseIndex: number;
  letterIndex: number;
  isDropping: boolean;
  isLanded: boolean;
  isDecoding: boolean;
  isComplete: boolean;
  position: { x: number; y: number };
  rotation: number;
  dropDelay: number;
}

interface TetrisLetterProps {
  letter: LetterState;
  onLand: () => void;
  onDecodeComplete: () => void;
}

function TetrisLetter({ letter, onLand, onDecodeComplete }: TetrisLetterProps) {
  const [currentChar, setCurrentChar] = useState(letter.char);
  const [isGlowing, setIsGlowing] = useState(false);
  const [dropProgress, setDropProgress] = useState(0);
  const decodeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropAnimationRef = useRef<number | null>(null);
  const landTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const decodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Drop animation with Tetris-style physics
  useEffect(() => {
    if (letter.isDropping) {
      const startTime = Date.now();
      const dropDuration = 800 + letter.dropDelay;
      const startY = -100;
      const endY = letter.position.y;

      const animateDrop = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / dropDuration, 1);
        
        // Tetris-style easing with bounce
        const easedProgress = progress < 0.8 
          ? progress * 1.25 
          : 0.8 + (progress - 0.8) * 0.2 + Math.sin((progress - 0.8) * Math.PI * 4) * 0.1;
        
        const currentY = startY + (endY - startY) * easedProgress;
        setDropProgress(easedProgress);
        
        if (progress < 1) {
          dropAnimationRef.current = requestAnimationFrame(animateDrop);
        } else {
          // Land with magnetic snap
          onLand();
        }
      };
      
      dropAnimationRef.current = requestAnimationFrame(animateDrop);
    }
  }, [letter.isDropping, letter.position.y, letter.dropDelay, onLand]);

  // Decoding animation after landing
  useEffect(() => {
    if (letter.isDecoding && !letter.isComplete) {
      setIsGlowing(true);
      let decodeCount = 0;
      const maxDecodes = 8 + Math.random() * 4;
      
      decodeIntervalRef.current = setInterval(() => {
        setCurrentChar(HACK_CHARS[Math.floor(Math.random() * HACK_CHARS.length)]);
        decodeCount++;
        
        if (decodeCount >= maxDecodes) {
          clearInterval(decodeIntervalRef.current!);
          setCurrentChar(letter.char);
          setIsGlowing(false);
          
          decodeTimeoutRef.current = setTimeout(() => {
            onDecodeComplete();
          }, 200);
        }
      }, 60 + Math.random() * 40);
    }
  }, [letter.isDecoding, letter.isComplete, letter.char, onDecodeComplete]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (dropAnimationRef.current) cancelAnimationFrame(dropAnimationRef.current);
      if (decodeIntervalRef.current) clearInterval(decodeIntervalRef.current);
      if (landTimeoutRef.current) clearTimeout(landTimeoutRef.current);
      if (decodeTimeoutRef.current) clearTimeout(decodeTimeoutRef.current);
    };
  }, []);

  const currentY = letter.isDropping 
    ? -100 + (letter.position.y + 100) * dropProgress 
    : letter.position.y;

  return (
    <div
      className={`
        absolute transition-all duration-200 ease-out
        ${letter.isDropping ? 'animate-disney-bounce' : ''}
        ${letter.isLanded && !letter.isDecoding ? 'animate-magnetic-snap' : ''}
        ${isGlowing ? 'animate-matrix-glow' : ''}
        ${letter.isComplete ? 'animate-hacking-decode' : ''}
      `}
      style={{
        left: `${letter.position.x}px`,
        top: `${currentY}px`,
        transform: `rotate(${letter.rotation}deg)`,
        zIndex: letter.phraseIndex * 10 + letter.letterIndex
      }}
    >
      <div className={`
        relative bg-black border rounded-sm px-1.5 py-1
        text-white font-mono text-base md:text-lg font-bold
        transition-all duration-200 ease-out
        w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
        letter-block
        ${isGlowing 
          ? 'decoding-active animate-matrix-glow' 
          : letter.isComplete 
            ? 'completed-letter' 
            : 'border-gray-600 bg-gray-800/30'
        }
        ${letter.isDropping ? 'scale-110' : letter.isComplete ? 'scale-100' : 'scale-95'}
      `}>
        <span className={`
          transition-all duration-100
          ${isGlowing ? 'text-green-400' : 'text-white'}
        `}>
          {currentChar === ' ' ? '\u00A0' : currentChar}
        </span>
        
        {/* Matrix glow effect during decoding */}
        {isGlowing && (
          <div className="absolute inset-0 rounded-sm bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-400/20 animate-pulse pointer-events-none"></div>
        )}
        
        {/* Scan line effect */}
        {isGlowing && (
          <div className="absolute inset-0 rounded-sm overflow-hidden pointer-events-none">
            <div className="w-full h-0.5 bg-green-400/60 scan-line"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TetrisLetterDecoder() {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visiblePhrases, setVisiblePhrases] = useState(0);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate letter positions with tight, compact spacing
  const calculateLetterPositions = () => {
    const letterWidth = 32; // Compact letter width (was 40)
    const letterHeight = 32; // Compact letter height (was 40)
    const phraseSpacing = 36; // Very tight vertical spacing between phrases (was 60)
    const letterSpacing = 2; // Minimal horizontal spacing between letters (was 5)
    
    const positions: LetterState[] = [];
    let globalLetterIndex = 0;
    
    DECODE_PHRASES.forEach((phrase, phraseIndex) => {
      const phraseY = phraseIndex * phraseSpacing + 20; // Start 20px from top (was 50)
      
      phrase.split('').forEach((char, letterIndex) => {
        const letterX = letterIndex * (letterWidth + letterSpacing) + 10; // Start 10px from left (was 20)
        
        positions.push({
          char,
          phraseIndex,
          letterIndex,
          isDropping: false,
          isLanded: false,
          isDecoding: false,
          isComplete: false,
          position: { x: letterX, y: phraseY },
          rotation: Math.random() * 20 - 10, // Random rotation for Tetris effect
          dropDelay: globalLetterIndex * 100 // Staggered drop timing
        });
        
        globalLetterIndex++;
      });
    });
    
    return positions;
  };

  // Start animation cycle
  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentLetterIndex(0);
    setVisiblePhrases(0);
    
    // Initialize all letters
    const allLetters = calculateLetterPositions();
    setLetters(allLetters);
    
    // Start dropping letters one by one
    const dropNextLetter = () => {
      if (currentLetterIndex < allLetters.length) {
        setLetters(prev => prev.map((letter, index) => 
          index === currentLetterIndex 
            ? { ...letter, isDropping: true }
            : letter
        ));
        
        // Update visible phrases count
        const currentLetter = allLetters[currentLetterIndex];
        const phraseIndex = currentLetter.phraseIndex;
        if (phraseIndex >= visiblePhrases) {
          setVisiblePhrases(phraseIndex + 1);
        }
        
        setCurrentLetterIndex(prev => prev + 1);
      } else {
        // Animation complete, restart after delay
        setTimeout(() => {
          setIsAnimating(false);
        }, 3000);
      }
    };
    
    // Start dropping with initial delay
    setTimeout(dropNextLetter, 500);
  };

  // Handle letter landing
  const handleLetterLand = (letterIndex: number) => {
    setLetters(prev => prev.map((letter, index) => 
      index === letterIndex 
        ? { ...letter, isDropping: false, isLanded: true, isDecoding: true }
        : letter
    ));
  };

  // Handle letter decode completion
  const handleDecodeComplete = (letterIndex: number) => {
    setLetters(prev => prev.map((letter, index) => 
      index === letterIndex 
        ? { ...letter, isDecoding: false, isComplete: true }
        : letter
    ));
    
    // Drop next letter after a short delay
    setTimeout(() => {
      if (currentLetterIndex < letters.length) {
        setLetters(prev => prev.map((letter, index) => 
          index === currentLetterIndex 
            ? { ...letter, isDropping: true }
            : letter
        ));
        
        // Update visible phrases count
        const currentLetter = letters[currentLetterIndex];
        const phraseIndex = currentLetter.phraseIndex;
        if (phraseIndex >= visiblePhrases) {
          setVisiblePhrases(phraseIndex + 1);
        }
        
        setCurrentLetterIndex(prev => prev + 1);
      }
    }, 200);
  };

  // Start animation on mount
  useEffect(() => {
    const timer = setTimeout(startAnimation, 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-restart animation
  useEffect(() => {
    if (!isAnimating) {
      animationTimeoutRef.current = setTimeout(startAnimation, 2000);
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
      <div className="text-center mb-6">
        <span className="text-gray-500 font-mono text-sm tracking-wider uppercase">
          // Tetris Decoder
        </span>
      </div>
      
      {/* Tetris Play Area - Compact and tight */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-3xl h-80 bg-black border border-gray-700 rounded-lg overflow-hidden"
        style={{ minHeight: '320px' }}
      >
        {/* Background grid for Tetris effect - tighter spacing */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px'
          }}></div>
        </div>
        
        {/* Letters */}
        {letters.map((letter, index) => (
          <TetrisLetter
            key={`${letter.phraseIndex}-${letter.letterIndex}`}
            letter={letter}
            onLand={() => handleLetterLand(index)}
            onDecodeComplete={() => handleDecodeComplete(index)}
          />
        ))}
        
        {/* Drop zone indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-green-400/30 animate-pulse"></div>
      </div>
      
      {/* Status Indicator */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-green-400 animate-status-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-gray-400 font-mono text-xs">
            {isAnimating ? 'DECODING...' : 'READY'}
          </span>
        </div>
        <div className="mt-2 text-gray-500 font-mono text-xs">
          Letters: {currentLetterIndex}/{letters.length}
        </div>
      </div>
    </div>
  );
} 