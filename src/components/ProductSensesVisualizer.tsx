import { useState, useEffect, useCallback } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface LightningLine {
  id: string;
  label: string;
  angle: number;
}

const LIGHTNING_LINES: LightningLine[] = [
  { id: "user-pain", label: "USER PAIN", angle: -60 },
  { id: "build-impact", label: "BUILD × IMPACT SENSE", angle: -36 },
  { id: "narrative-fit", label: "NARRATIVE FIT", angle: -12 },
  { id: "timing-instinct", label: "TIMING INSTINCT", angle: 12 },
  { id: "tradeoff-radar", label: "TRADEOFF RADAR", angle: 36 },
  { id: "signal-detection", label: "SIGNAL DETECTION", angle: 60 }
];

interface ProductSensesVisualizerProps {
  theme?: "dark" | "light";
}

// Brain Component - Stylized, front-facing, low-poly brain
const Brain = ({ theme = "dark" }: { theme?: "dark" | "light" }) => {
  const isDark = theme === "dark";
  return (
    <svg
      width="200"
      height="240"
      viewBox="0 0 200 240"
      className="drop-shadow-2xl"
      style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.18))" }}
    >
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#f3f4f6" : "#e5e7eb"} />
          <stop offset="100%" stopColor={isDark ? "#fff" : "#d1d5db"} />
        </linearGradient>
        <filter id="brainGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Main brain shape: stylized, geometric, front-facing, low-poly */}
      <path
        d="M 100 40
          Q 60 40 50 80
          Q 30 110 50 150
          Q 40 200 100 210
          Q 160 200 150 150
          Q 170 110 150 80
          Q 140 40 100 40
          Z"
        fill="url(#brainGradient)"
        stroke={isDark ? "#d1d5db" : "#6b7280"}
        strokeWidth="2.5"
        filter="url(#brainGlow)"
      />
      {/* Central fissure */}
      <path
        d="M 100 45 Q 95 80 100 210 Q 105 80 100 45"
        fill="none"
        stroke={isDark ? "#cbd5e1" : "#9ca3af"}
        strokeWidth="2.2"
        strokeDasharray="6 6"
        opacity="0.7"
      />
      {/* Left hemisphere polygons */}
      <polygon points="100,60 80,70 70,100 80,130 100,140" fill="#f3f4f6" opacity="0.7" />
      <polygon points="100,140 80,130 70,160 90,180 100,170" fill="#e5e7eb" opacity="0.7" />
      <polygon points="100,170 90,180 100,200 110,180" fill="#d1d5db" opacity="0.7" />
      {/* Right hemisphere polygons */}
      <polygon points="100,60 120,70 130,100 120,130 100,140" fill="#f3f4f6" opacity="0.7" />
      <polygon points="100,140 120,130 130,160 110,180 100,170" fill="#e5e7eb" opacity="0.7" />
      <polygon points="100,170 110,180 100,200 90,180" fill="#d1d5db" opacity="0.7" />
      {/* Subtle hemisphere highlights */}
      <ellipse cx="85" cy="100" rx="8" ry="16" fill="#fff" opacity="0.18" />
      <ellipse cx="115" cy="100" rx="8" ry="16" fill="#fff" opacity="0.18" />
      {/* Subtle shadow under brain */}
      <ellipse cx="100" cy="215" rx="38" ry="10" fill="#000" opacity="0.10" />
    </svg>
  );
};

export function ProductSensesVisualizer({ theme = "dark" }: ProductSensesVisualizerProps) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const brainControls = useAnimationControls();
  const lightningControls = useAnimationControls();
  const labelControls = useAnimationControls();
  const isDark = theme === "dark";

  // Brain breathing and floating animation
  useEffect(() => {
    brainControls.start({
      scale: [1, 1.04, 1],
      rotate: [0, 1, -1, 0],
      y: [-5, 5, -5],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [brainControls]);

  // Lightning reveal animation
  useEffect(() => {
    lightningControls.start({
      strokeDashoffset: [1000, 0],
      transition: {
        duration: 1.5,
        delay: 0.5,
        ease: "easeOut"
      }
    });
  }, [lightningControls]);

  // Label stagger animation
  useEffect(() => {
    labelControls.start((i) => ({
      opacity: [0, 1],
      y: [20, 0],
      transition: {
        delay: 1 + i * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    }));
  }, [labelControls]);

  // Generate lightning path with organic zigzag
  const generateLightningPath = useCallback((startX: number, startY: number, endX: number, endY: number, seed: number) => {
    const segments = 8;
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
      
      // Organic zigzag for lightning effect
      const offsetX = (random(0, 1) - 0.5) * 12;
      const offsetY = (random(0, 1) - 0.5) * 12;
      
      path += ` L ${x + offsetX} ${y + offsetY}`;
    }
    
    return path;
  }, []);

  return (
    <div className={`relative w-full h-full ${isDark ? 'bg-black' : 'bg-white'} flex justify-center items-center overflow-hidden`}>
      {/* Brain Container */}
      <div className="relative z-30">
        <motion.div
          animate={brainControls}
          className="relative"
        >
          <Brain theme={theme} />
        </motion.div>
      </div>

      {/* Lightning Lines */}
      <div className="absolute inset-0 z-20">
        {LIGHTNING_LINES.map((line, index) => {
          const angleRad = (line.angle * Math.PI) / 180;
          const radius = 180;
          const centerX = 100;
          const centerY = 120;
          
          // Calculate positions
          const endX = centerX + radius * Math.cos(angleRad);
          const endY = centerY + radius * Math.sin(angleRad);
          const startX = centerX + 30 * Math.cos(angleRad);
          const startY = centerY + 30 * Math.sin(angleRad);
          
          const lightningPath = generateLightningPath(startX, startY, endX, endY, index);

          return (
            <motion.svg
              key={line.id}
              width="100%"
              height="100%"
              className="absolute left-0 top-0 pointer-events-none"
              animate={lightningControls}
              custom={index}
            >
              {/* Glow effect */}
              <motion.path
                d={lightningPath}
                stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1000"
                strokeDashoffset={1000}
                animate={{
                  strokeDashoffset: [1000, 0],
                  opacity: hoveredLabel === line.id ? 0.6 : 0.3,
                }}
                transition={{
                  strokeDashoffset: {
                    duration: 1.5,
                    delay: 0.5 + index * 0.1,
                    ease: "easeOut"
                  },
                  opacity: { duration: 0.2 }
                }}
                filter="blur(2px)"
              />
              
              {/* Primary lightning bolt */}
              <motion.path
                d={lightningPath}
                stroke={isDark ? "white" : "black"}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1000"
                strokeDashoffset={1000}
                animate={{
                  strokeDashoffset: [1000, 0],
                  opacity: hoveredLabel === line.id ? 1 : 0.8,
                }}
                transition={{
                  strokeDashoffset: {
                    duration: 1.5,
                    delay: 0.5 + index * 0.1,
                    ease: "easeOut"
                  },
                  opacity: { duration: 0.2 }
                }}
                filter="drop-shadow(0 0 3px rgba(255,255,255,0.5))"
              />
            </motion.svg>
          );
        })}
      </div>

      {/* Labels */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        {LIGHTNING_LINES.map((line, index) => {
          const angleRad = (line.angle * Math.PI) / 180;
          const radius = 200;
          const centerX = 100;
          const centerY = 120;
          
          const labelX = centerX + radius * Math.cos(angleRad);
          const labelY = centerY + radius * Math.sin(angleRad);

          return (
            <motion.div
              key={line.id}
              className={`absolute font-mono text-xs uppercase tracking-widest cursor-pointer pointer-events-auto select-none ${
                isDark ? 'text-white' : 'text-black'
              }`}
              style={{
                left: `${labelX}px`,
                top: `${labelY}px`,
                transform: "translate(-50%, -50%)",
                fontFamily: "'JetBrains Mono', 'DM Mono', monospace",
              }}
              animate={labelControls}
              custom={index}
              onMouseEnter={() => setHoveredLabel(line.id)}
              onMouseLeave={() => setHoveredLabel(null)}
              whileHover={{
                scale: 1.1,
                color: isDark ? "#fbbf24" : "#d97706",
                transition: { duration: 0.2 }
              }}
            >
              {line.label}
            </motion.div>
          );
        })}
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-80 h-80 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-white/5' : 'bg-black/5'
        }`} />
      </div>
    </div>
  );
} 