"use client"

import React, { useState, useEffect, useRef } from 'react'

interface HARNEETPreloaderProps {
  onComplete: () => void
}

interface LetterFill {
  progress: number
  isActive: boolean
  pathPoints: { x: number, y: number }[]
  stylusReached: boolean
}

const HARNEETPreloader: React.FC<HARNEETPreloaderProps> = ({ onComplete }) => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [letterFills, setLetterFills] = useState<LetterFill[]>([
    { progress: 0, isActive: false, pathPoints: [], stylusReached: false },
    { progress: 0, isActive: false, pathPoints: [], stylusReached: false },
    { progress: 0, isActive: false, pathPoints: [], stylusReached: false },
    { progress: 0, isActive: false, pathPoints: [], stylusReached: false },
    { progress: 0, isActive: false, pathPoints: [], stylusReached: false },
    { progress: 0, isActive: false, pathPoints: [], stylusReached: false },
    { progress: 0, isActive: false, pathPoints: [], stylusReached: false }
  ])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)
  const fallbackTimerRef = useRef<NodeJS.Timeout>()
  const progressTimerRef = useRef<NodeJS.Timeout>()
  const totalDuration = 4000 // Exactly 4 seconds

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Progress timer for smooth progress updates
  useEffect(() => {
    if (isCompleted) return;
    
    const startTime = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(progressTimerRef.current!);
      }
    }, 50); // Update every 50ms for smooth progress

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isCompleted]);

  // Handle completion with smooth fade-out
  const handleComplete = () => {
    setFadeOut(true);
    // Wait for fade-out animation to complete before calling onComplete
    setTimeout(() => {
      onComplete();
    }, 500); // 500ms fade-out duration
  };

  // Strict 4-second fallback timer
  useEffect(() => {
    fallbackTimerRef.current = setTimeout(() => {
      console.log('Fallback timer triggered - forcing completion after 4 seconds')
      if (!isCompleted) {
        setIsCompleted(true)
        setProgress(100)
        // Small delay to ensure state updates before calling handleComplete
        setTimeout(() => {
          handleComplete()
        }, 100)
      }
    }, totalDuration)

    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
      }
    }
  }, [isCompleted])

  // Safety mechanism to ensure animation completes
  useEffect(() => {
    if (currentLetterIndex >= 7 && !isCompleted) {
      console.log('All letters completed, forcing preloader completion');
      setIsCompleted(true)
      setProgress(100)
      // Small delay to ensure state updates before calling handleComplete
      setTimeout(() => {
        handleComplete();
      }, 100);
    }
  }, [currentLetterIndex, isCompleted]);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  // Generate organic drawing path for a letter
  const generateDrawingPath = (letter: string): { x: number, y: number }[] => {
    const letterWidth = 140
    const letterHeight = 180
    
    // Letter-specific drawing patterns with more organic curves
    const patterns = {
      'H': [
        { x: 0, y: letterHeight * 0.8 },           // Bottom left
        { x: 0, y: letterHeight * 0.2 },           // Top left
        { x: letterWidth * 0.4, y: letterHeight * 0.2 }, // Top middle
        { x: letterWidth * 0.6, y: letterHeight * 0.2 }, // Top middle
        { x: letterWidth, y: letterHeight * 0.2 },       // Top right
        { x: letterWidth, y: letterHeight * 0.8 },       // Bottom right
        { x: letterWidth * 0.6, y: letterHeight * 0.8 }, // Bottom middle
        { x: letterWidth * 0.4, y: letterHeight * 0.8 }, // Bottom middle
      ],
      'A': [
        { x: letterWidth * 0.2, y: letterHeight * 0.8 }, // Bottom left
        { x: letterWidth * 0.5, y: letterHeight * 0.1 }, // Top peak
        { x: letterWidth * 0.8, y: letterHeight * 0.8 }, // Bottom right
        { x: letterWidth * 0.3, y: letterHeight * 0.5 }, // Cross start
        { x: letterWidth * 0.7, y: letterHeight * 0.5 }, // Cross end
      ],
      'R': [
        { x: 0, y: letterHeight * 0.8 },           // Bottom left
        { x: 0, y: letterHeight * 0.2 },           // Top left
        { x: letterWidth * 0.7, y: letterHeight * 0.2 }, // Top right
        { x: letterWidth, y: letterHeight * 0.3 },       // Curve start
        { x: letterWidth * 0.8, y: letterHeight * 0.5 }, // Curve middle
        { x: letterWidth * 0.6, y: letterHeight * 0.7 }, // Curve end
        { x: letterWidth * 0.3, y: letterHeight * 0.6 }, // Leg start
        { x: letterWidth * 0.1, y: letterHeight * 0.8 }, // Leg end
      ],
      'N': [
        { x: 0, y: letterHeight * 0.8 },           // Bottom left
        { x: 0, y: letterHeight * 0.2 },           // Top left
        { x: letterWidth * 0.8, y: letterHeight * 0.8 }, // Bottom right
        { x: letterWidth, y: letterHeight * 0.2 },       // Top right
      ],
      'E': [
        { x: 0, y: letterHeight * 0.8 },           // Bottom left
        { x: 0, y: letterHeight * 0.2 },           // Top left
        { x: letterWidth, y: letterHeight * 0.2 },       // Top right
        { x: 0, y: letterHeight * 0.2 },           // Back to left
        { x: letterWidth * 0.8, y: letterHeight * 0.45 }, // Middle right
        { x: 0, y: letterHeight * 0.45 },          // Back to left
        { x: letterWidth, y: letterHeight * 0.8 },       // Bottom right
      ],
      'T': [
        { x: letterWidth * 0.2, y: letterHeight * 0.2 }, // Top left
        { x: letterWidth * 0.8, y: letterHeight * 0.2 }, // Top right
        { x: letterWidth * 0.5, y: letterHeight * 0.2 }, // Top center
        { x: letterWidth * 0.5, y: letterHeight * 0.8 }, // Bottom center
      ]
    }
    
    const basePath = patterns[letter as keyof typeof patterns] || patterns['H']
    
    // Add organic variations and smooth interpolation for more human-like movement
    const organicPath: { x: number, y: number }[] = []
    
    for (let i = 0; i < basePath.length - 1; i++) {
      const current = basePath[i]
      const next = basePath[i + 1]
      
      // Add current point
      organicPath.push(current)
      
      // Add intermediate points with organic variations
      const steps = 12 // More points for smoother curves and better brush control
      for (let j = 1; j < steps; j++) {
        const t = j / steps
        
        // Use easing for more natural hand movement
        const easedT = easeInOutCubic(t)
        const x = current.x + (next.x - current.x) * easedT
        const y = current.y + (next.y - current.y) * easedT
        
        // Add natural hand tremor and organic variation
        const tremorX = (Math.random() - 0.5) * 3 // Slightly more tremor for human feel
        const tremorY = (Math.random() - 0.5) * 3
        const organicX = x + tremorX
        const organicY = y + tremorY
        
        organicPath.push({ x: organicX, y: organicY })
      }
    }
    
    // Add final point
    organicPath.push(basePath[basePath.length - 1])
    
    // Add some additional micro-movements for brush bristle effect
    const finalPath: { x: number, y: number }[] = []
    for (let i = 0; i < organicPath.length; i++) {
      finalPath.push(organicPath[i])
      
      // Add micro-movements between points for brush bristle texture
      if (i < organicPath.length - 1) {
        const current = organicPath[i]
        const next = organicPath[i + 1]
        
        // Add 2-3 micro-points for brush bristle effect
        const microSteps = 2 + Math.floor(Math.random() * 2)
        for (let j = 1; j <= microSteps; j++) {
          const t = j / (microSteps + 1)
          const microX = current.x + (next.x - current.x) * t
          const microY = current.y + (next.y - current.y) * t
          
          // Add very subtle bristle variations
          const bristleX = microX + (Math.random() - 0.5) * 1.5
          const bristleY = microY + (Math.random() - 0.5) * 1.5
          
          finalPath.push({ x: bristleX, y: bristleY })
        }
      }
    }
    
    return finalPath
  }

  // Create SVG mask for organic fill following stylus path
  const createStylusMask = (letterIndex: number, progress: number) => {
    if (progress === 0) return 'none';
    
    const letterFill = letterFills[letterIndex];
    if (!letterFill || letterFill.pathPoints.length === 0 || !letterFill.stylusReached) return 'none';
    
    // Take points up to current progress
    const pointsToUse = letterFill.pathPoints.slice(0, Math.floor(letterFill.pathPoints.length * progress));
    if (pointsToUse.length === 0) return 'none';
    
    // Create multiple overlapping brush strokes for realistic human painting
    let allPaths = '';
    
    // Main stylus path with organic brush strokes
    if (pointsToUse.length > 1) {
      // Create multiple overlapping brush strokes along the path
      for (let i = 1; i < pointsToUse.length; i++) {
        const currentPoint = pointsToUse[i];
        const previousPoint = pointsToUse[i - 1];
        
        // Calculate movement characteristics
        const dx = currentPoint.x - previousPoint.x;
        const dy = currentPoint.y - previousPoint.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Simulate realistic pressure variation (slower = more pressure = wider brush)
        const pressure = Math.max(0.4, 1 - (speed / 40));
        const baseBrushWidth = 8 + (pressure * 12); // 8-20px brush width
        
        // Add organic brush shape with natural variations
        const brushVariation = (Math.random() - 0.5) * 4;
        const brushWidth = baseBrushWidth + brushVariation;
        
        // Create organic brush stroke with irregular shape (like real brush)
        const brushPoints = 8; // More points for organic shape
        let brushPath = '';
        
        for (let j = 0; j < brushPoints; j++) {
          const angleVariation = (Math.random() - 0.5) * 0.3; // Slight angle variation
          const radiusVariation = 0.7 + (Math.random() * 0.6); // Varying radius for organic feel
          
          const brushAngle = angle + angleVariation;
          const radius = brushWidth * radiusVariation;
          
          const brushX = currentPoint.x + Math.cos(brushAngle) * radius;
          const brushY = currentPoint.y + Math.sin(brushAngle) * radius;
          
          if (j === 0) {
            brushPath += `M ${brushX} ${brushY}`;
          } else {
            brushPath += ` L ${brushX} ${brushY}`;
          }
        }
        
        // Close the brush stroke
        brushPath += ` Z`;
        allPaths += brushPath;
        
        // Add overlapping secondary brush strokes for paint texture
        if (i % 2 === 0) { // Every other point gets a secondary stroke
          const secondaryBrushWidth = brushWidth * (0.6 + Math.random() * 0.4);
          let secondaryPath = '';
          
          for (let k = 0; k < 6; k++) {
            const secondaryAngle = angle + (Math.random() - 0.5) * 0.5;
            const secondaryRadius = secondaryBrushWidth * (0.8 + Math.random() * 0.4);
            
            const secondaryX = currentPoint.x + Math.cos(secondaryAngle) * secondaryRadius;
            const secondaryY = currentPoint.y + Math.sin(secondaryAngle) * secondaryRadius;
            
            if (k === 0) {
              secondaryPath += `M ${secondaryX} ${secondaryY}`;
            } else {
              secondaryPath += ` L ${secondaryX} ${secondaryY}`;
            }
          }
          
          secondaryPath += ` Z`;
          allPaths += secondaryPath;
        }
      }
    }
    
    // Add paint splatter and texture effects
    if (pointsToUse.length > 3) {
      const lastPoint = pointsToUse[pointsToUse.length - 1];
      
      // Create paint splatter effect (like when brush lifts)
      const splatterCount = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < splatterCount; i++) {
        const splatterAngle = Math.random() * Math.PI * 2;
        const splatterDistance = 5 + Math.random() * 15;
        const splatterSize = 2 + Math.random() * 6;
        
        const splatterX = lastPoint.x + Math.cos(splatterAngle) * splatterDistance;
        const splatterY = lastPoint.y + Math.sin(splatterAngle) * splatterDistance;
        
        // Create irregular splatter shape
        let splatterPath = '';
        const splatterPoints = 5 + Math.floor(Math.random() * 4);
        
        for (let j = 0; j < splatterPoints; j++) {
          const t = j / splatterPoints;
          const angle = (t * Math.PI * 2) + (Math.random() - 0.5) * 0.5;
          const radius = splatterSize * (0.7 + Math.random() * 0.6);
          
          const x = splatterX + Math.cos(angle) * radius;
          const y = splatterY + Math.sin(angle) * radius;
          
          if (j === 0) {
            splatterPath += `M ${x} ${y}`;
          } else {
            splatterPath += ` L ${x} ${y}`;
          }
        }
        
        splatterPath += ` Z`;
        allPaths += splatterPath;
      }
    }
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="180">
      <defs>
        <mask id="mask-${letterIndex}">
          <rect width="140" height="180" fill="black"/>
          <g fill="white">
            ${allPaths}
          </g>
        </mask>
      </defs>
    </svg>`;
    
    return `url("data:image/svg+xml;base64,${btoa(svgContent)}")`;
  };

  // Handle letter animation timing - synchronized to total 5 seconds
  useEffect(() => {
    if (prefersReducedMotion || isCompleted) {
      // If reduced motion is preferred, complete immediately
      if (prefersReducedMotion && !isCompleted) {
        console.log('Reduced motion detected - completing preloader immediately');
        setIsCompleted(true);
        setProgress(100);
        // Small delay to ensure state updates before calling onComplete
        setTimeout(() => {
          onComplete();
        }, 100);
      }
      return;
    }
    
    console.log('Starting stylus-following fill animation...');
    
    const animateLetter = (index: number) => {
      if (index > 6 || isCompleted) {
        console.log('All letters completed or preloader completed!');
        return;
      }
      
      console.log(`Starting drawing for letter ${index}: ${['H', 'A', 'R', 'N', 'E', 'E', 'T'][index]}`);
      
      // Generate drawing path for this letter
      const letter = ['H', 'A', 'R', 'N', 'E', 'E', 'T'][index];
      const path = generateDrawingPath(letter);
      
      // Initialize letter fill with path points but NO progress yet
      setLetterFills(prev => prev.map((item, idx) => 
        idx === index ? { ...item, isActive: true, pathPoints: path, stylusReached: false, progress: 0 } : item
      ));
      
      // Animation timing - synchronized to total 4 seconds
      // Each letter gets approximately 571ms (4000ms / 7 letters)
      const duration = Math.floor(totalDuration / 7);
      const startTime = Date.now();
      startTimeRef.current = startTime;
      
      const animateStylus = () => {
        if (isCompleted || prefersReducedMotion) return; // Stop if preloader completed or reduced motion
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for more natural movement
        const easedProgress = easeInOutCubic(progress);
        
        // Update stylus position along the path with smooth interpolation
        if (path.length > 0) {
          const pathIndex = easedProgress * (path.length - 1);
          const currentPoint = path[Math.floor(pathIndex)];
          const nextPoint = path[Math.min(Math.floor(pathIndex) + 1, path.length - 1)];
          
          if (currentPoint && nextPoint) {
            // Only start filling when stylus actually reaches the letter area
            if (progress > 0.1) { // Small delay to ensure stylus is in position
              setLetterFills(prev => prev.map((item, idx) => {
                if (idx === index) {
                  // Mark stylus as reached and start filling
                  if (!item.stylusReached) {
                    console.log(`Stylus reached letter ${index} (${letter})`);
                  }
                  return { 
                    ...item, 
                    stylusReached: true,
                    progress: easedProgress - 0.1 // Start from 0 after stylus reaches
                  };
                }
                return item;
              }));
            }
          }
        }
        
        if (progress < 1 && !isCompleted && !prefersReducedMotion) {
          animationRef.current = requestAnimationFrame(animateStylus);
        } else {
          console.log(`Letter ${index} (${letter}) completed!`);
          
          // Brief pause (0.1s), then move to next letter
          setTimeout(() => {
            if (!isCompleted && !prefersReducedMotion) {
              setCurrentLetterIndex(index + 1);
              if (index < 6) {
                animateLetter(index + 1);
              }
            }
          }, 100);
        }
      };
      
      animateStylus();
    };
    
    // Start with first letter
    animateLetter(0);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [prefersReducedMotion, isCompleted, onComplete]);

  // Easing function for natural movement
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  return (
    <div 
      className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[999999] overflow-hidden transition-all duration-500 ease-in-out ${
        fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        backgroundColor: 'black'
      }}
    >
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4">
        {/* HARNEET Text Container */}
        <div className="relative mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10 2xl:space-x-12">
            {['H', 'A', 'R', 'N', 'E', 'E', 'T'].map((letter, index) => (
              <div 
                key={index} 
                className="relative" 
                data-letter-index={index}
              >
                {/* Outlined Letter (always visible) */}
                <div 
                  className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[11rem] 2xl:text-[15rem] font-black text-transparent"
                  style={{
                    WebkitTextStroke: '2px white',
                    fontFamily: 'Arial Black, sans-serif',
                    letterSpacing: '0.03em',
                    width: 'clamp(40px, 8vw, 140px)',
                    height: 'clamp(50px, 10vw, 180px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {letter}
                </div>
                
                {/* Paint Fill Layer - follows stylus path ONLY when stylus reaches */}
                {letterFills[index].stylusReached && (
                  <div 
                    className="absolute inset-0 text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[11rem] 2xl:text-[15rem] font-black text-white flex items-center justify-center overflow-hidden"
                    style={{
                      fontFamily: 'Arial Black, sans-serif',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {/* White fill that follows stylus movement - only when stylus reaches */}
                    <div 
                      className="absolute inset-0 bg-white"
                      style={{
                        WebkitMask: createStylusMask(index, letterFills[index].progress),
                        mask: createStylusMask(index, letterFills[index].progress)
                      }}
                    />
                    
                    {/* Letter text overlay */}
                    <div 
                      className="absolute inset-0 text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[11rem] 2xl:text-[15rem] font-black text-white flex items-center justify-center"
                      style={{
                        fontFamily: 'Arial Black, sans-serif',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {letter}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Subtitle */}
        <div className="text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-6 md:mb-8 font-light text-center">
          Portfolio Loading
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 sm:w-80 md:w-96 bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress Text */}
        <div className="text-sm text-white/60 mt-3 font-mono">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  )
}

export default HARNEETPreloader
