import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, easeInOut, easeOut } from "framer-motion";

interface SpiderSenseLine {
  id: string;
  label: string;
  angle: number; // angle in degrees
}

const SPIDER_SENSE_LINES: SpiderSenseLine[] = [
  { id: "user-pain", label: "USER PAIN", angle: -60 },
  { id: "build-impact", label: "BUILD × IMPACT SENSE", angle: -36 },
  { id: "narrative-fit", label: "NARRATIVE FIT", angle: -12 },
  { id: "timing-instinct", label: "TIMING INSTINCT", angle: 12 },
  { id: "tradeoff-radar", label: "TRADEOFF RADAR", angle: 36 },
  { id: "signal-detection", label: "SIGNAL DETECTION", angle: 60 },
];

export function ComicStyleBrain() {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  // Breathing animation variants
  const breathingVariants = {
    breathe: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  // Label animation variants
  const labelVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: easeOut,
      },
    }),
  };

  // Line animation variants
  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: (i: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.8,
        ease: easeOut,
      },
    }),
  };

  // Generate jagged path for spider-sense lines
  const generateJaggedPath = useCallback((startX: number, startY: number, endX: number, endY: number, seed: number) => {
    const segments = 4;
    let path = `M ${startX} ${startY}`;
    
    // Use seed for consistent randomness
    const random = (min: number, max: number) => {
      const x = Math.sin(seed++) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = startX + (endX - startX) * t;
      const y = startY + (endY - startY) * t;
      
      // Add jagged offset
      const offsetX = (random(0, 1) - 0.5) * 8;
      const offsetY = (random(0, 1) - 0.5) * 8;
      
      path += ` L ${x + offsetX} ${y + offsetY}`;
    }
    
    return path;
  }, []);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Brain Container */}
      <div className="relative z-10">
        <motion.div
          variants={breathingVariants}
          animate="breathe"
          className="relative"
        >
          {/* Comic-style Brain SVG */}
          <svg
            width="200"
            height="240"
            viewBox="0 0 200 240"
            className="drop-shadow-lg"
          >
            {/* Brain outline with soft gray stroke */}
            <path
              d="M 40 80 
                 C 30 60, 25 40, 35 25 
                 C 45 15, 60 10, 80 12 
                 C 100 15, 120 20, 140 25 
                 C 150 30, 155 40, 150 60 
                 C 145 80, 140 100, 135 120 
                 C 130 140, 125 160, 120 180 
                 C 115 200, 110 220, 105 230 
                 C 100 235, 95 240, 90 235 
                 C 85 230, 80 220, 75 200 
                 C 70 180, 65 160, 60 140 
                 C 55 120, 50 100, 45 80 
                 Z"
              fill="white"
              stroke="#666666"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            
            {/* Brain folds - comic style */}
            <path
              d="M 50 70 C 45 60, 50 50, 60 45 C 70 40, 80 45, 85 55"
              fill="none"
              stroke="#CCCCCC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 70 90 C 65 80, 70 70, 80 65 C 90 60, 100 65, 105 75"
              fill="none"
              stroke="#CCCCCC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 90 110 C 85 100, 90 90, 100 85 C 110 80, 120 85, 125 95"
              fill="none"
              stroke="#CCCCCC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 110 130 C 105 120, 110 110, 120 105 C 130 100, 140 105, 145 115"
              fill="none"
              stroke="#CCCCCC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 130 150 C 125 140, 130 130, 140 125 C 150 120, 160 125, 165 135"
              fill="none"
              stroke="#CCCCCC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Additional comic-style details */}
            <circle cx="70" cy="60" r="2" fill="#CCCCCC" />
            <circle cx="90" cy="80" r="2" fill="#CCCCCC" />
            <circle cx="110" cy="100" r="2" fill="#CCCCCC" />
            <circle cx="130" cy="120" r="2" fill="#CCCCCC" />
          </svg>
        </motion.div>
      </div>

      {/* Spider-Sense Lines and Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {SPIDER_SENSE_LINES.map((line, index) => {
          const angleRad = (line.angle * Math.PI) / 180;
          const radius = 180;
          const centerX = 100;
          const centerY = 120;
          
          // Calculate label position
          const labelX = centerX + radius * Math.cos(angleRad);
          const labelY = centerY + radius * Math.sin(angleRad);
          
          // Calculate line end position (closer to brain)
          const lineEndX = centerX + (radius - 40) * Math.cos(angleRad);
          const lineEndY = centerY + (radius - 40) * Math.sin(angleRad);
          
          // Line start position (at brain edge)
          const lineStartX = centerX + 30 * Math.cos(angleRad);
          const lineStartY = centerY + 30 * Math.sin(angleRad);

          return (
            <div key={line.id} className="absolute inset-0">
              {/* Spider-Sense Line */}
              <motion.svg
                width="100%"
                height="100%"
                className="absolute left-0 top-0 pointer-events-none"
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <motion.path
                  d={generateJaggedPath(lineStartX, lineStartY, lineEndX, lineEndY, index)}
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{
                    opacity: hoveredLine === line.id ? 1 : 0.7,
                    strokeWidth: hoveredLine === line.id ? 3 : 2,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.svg>

              {/* Label */}
              <motion.div
                className="absolute font-mono text-[#EAEAEA] text-sm font-medium tracking-wider cursor-pointer pointer-events-auto select-none"
                style={{
                  left: `${labelX}px`,
                  top: `${labelY}px`,
                  transform: "translate(-50%, -50%)",
                  fontFamily: "'JetBrains Mono', 'DM Mono', monospace",
                }}
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                onMouseEnter={() => setHoveredLine(line.id)}
                onMouseLeave={() => setHoveredLine(null)}
                whileHover={{
                  scale: 1.1,
                  color: "#FFFFFF",
                  transition: { duration: 0.2 },
                }}
              >
                {line.label}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Optional: Subtle glow effect around brain */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
} 