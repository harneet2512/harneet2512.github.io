import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightningBolt {
  id: string;
  label: string;
  angle: number;
  delay: number;
  path: string;
}

const LIGHTNING_BOLTS: LightningBolt[] = [
  {
    id: "user-pain",
    label: "USER PAIN",
    angle: 135, // Top-left
    delay: 0,
    path: ""
  },
  {
    id: "signal-detection", 
    label: "SIGNAL DETECTION",
    angle: 45, // Top-right
    delay: 0.8,
    path: ""
  },
  {
    id: "tradeoff-radar",
    label: "TRADEOFF RADAR", 
    angle: 0, // Right
    delay: 1.6,
    path: ""
  },
  {
    id: "timing-instinct",
    label: "TIMING INSTINCT",
    angle: 315, // Bottom-right
    delay: 2.4,
    path: ""
  },
  {
    id: "build-impact",
    label: "BUILD x IMPACT SENSE",
    angle: 225, // Bottom-left
    delay: 3.2,
    path: ""
  }
];

// Generate jagged lightning path with sharp angular segments
const generateJaggedLightningPath = (startX: number, startY: number, endX: number, endY: number): string => {
  const segments = 4; // 3-4 sharp angular segments
  let path = `M ${startX} ${startY}`;
  
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const baseX = startX + (endX - startX) * t;
    const baseY = startY + (endY - startY) * t;
    
    // Sharp angular variations (30-45 degree angles)
    const angleVariation = 25 + Math.random() * 20; // 25-45px variation
    const perpendicularAngle = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;
    const offsetX = angleVariation * Math.cos(perpendicularAngle) * (Math.random() > 0.5 ? 1 : -1);
    const offsetY = angleVariation * Math.sin(perpendicularAngle) * (Math.random() > 0.5 ? 1 : -1);
    
    path += ` L ${baseX + offsetX} ${baseY + offsetY}`;
  }
  
  return path;
};

export function JarvisWireframeBrain() {
  const [currentBoltIndex, setCurrentBoltIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const brainRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout>();

  // Brain wireframe path - clean white outline
  const brainWireframePath = `
    M -1.2 0.8 
    L -0.8 1.2 L 0 1.4 L 0.8 1.2 L 1.2 0.8 L 1.4 0.4
    L 1.4 0 L 1.2 -0.4 L 0.8 -0.8 L 0.4 -1.0 L 0 -1.2
    L -0.4 -1.0 L -0.8 -0.8 L -1.0 -0.4 L -1.2 0
    L -1.4 0.4 L -1.2 0.8
    M -0.4 -1.4 L 0 -1.6 L 0.4 -1.4 L 0.4 -1.0
  `;

  // Start lightning animation sequence
  const startLightningSequence = () => {
    setIsAnimating(true);
    setCurrentBoltIndex(-1);

    // Brain appears first
    setTimeout(() => {
      setCurrentBoltIndex(0);
    }, 500);

    // Lightning bolts appear sequentially
    LIGHTNING_BOLTS.forEach((_, index) => {
      setTimeout(() => {
        setCurrentBoltIndex(index);
      }, 500 + (index * 800));
    });

    // Reset after sequence completes
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentBoltIndex(-1);
    }, 500 + (LIGHTNING_BOLTS.length * 800) + 1000);
  };

  // Auto-start animation and loop
  useEffect(() => {
    startLightningSequence();
    
    // Loop every 8 seconds
    animationRef.current = setInterval(startLightningSequence, 8000);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* Brain Wireframe */}
      <motion.div
        ref={brainRef}
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isAnimating ? 1 : 0.8, 
          scale: isAnimating ? 1 : 0.95 
        }}
        transition={{ duration: 0.5 }}
      >
        <svg
          width="200"
          height="200"
          viewBox="-2 -2 4 4"
          className="absolute inset-0"
        >
          {/* Brain wireframe outline */}
          <motion.path
            d={brainWireframePath}
            stroke="#ffffff"
            strokeWidth="0.05"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: isAnimating ? 1 : 0.8, 
              opacity: isAnimating ? 1 : 0.6 
            }}
            transition={{ 
              pathLength: { duration: 1.5, ease: "easeInOut" },
              opacity: { duration: 0.5 }
            }}
          />
        </svg>

        {/* Gentle rotation animation */}
        <motion.div
          animate={{ rotate: isAnimating ? 360 : 0 }}
          transition={{ 
            duration: 20, 
            ease: "linear", 
            repeat: Infinity 
          }}
          className="absolute inset-0"
        >
          <svg
            width="200"
            height="200"
            viewBox="-2 -2 4 4"
          >
            <path
              d={brainWireframePath}
              stroke="#ffffff"
              strokeWidth="0.05"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Lightning Bolts */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="-2 -2 4 4"
      >
        {LIGHTNING_BOLTS.map((bolt, index) => {
          const radius = 1.5; // 150px from brain center
          const boltLength = 1.0; // 100px outward
          
          const startX = Math.cos((bolt.angle - 90) * Math.PI / 180) * radius;
          const startY = Math.sin((bolt.angle - 90) * Math.PI / 180) * radius;
          const endX = Math.cos((bolt.angle - 90) * Math.PI / 180) * (radius + boltLength);
          const endY = Math.sin((bolt.angle - 90) * Math.PI / 180) * (radius + boltLength);

          const lightningPath = generateJaggedLightningPath(startX, startY, endX, endY);

          return (
            <g key={bolt.id}>
              {/* Lightning Bolt */}
              <AnimatePresence>
                {currentBoltIndex >= index && (
                  <motion.path
                    d={lightningPath}
                    stroke="#ffffff"
                    strokeWidth="0.02"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ 
                      pathLength: 0, 
                      opacity: 0,
                      filter: "drop-shadow(0 0 0px rgba(255,255,255,0))"
                    }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: 1,
                      filter: "drop-shadow(0 0 5px rgba(255,255,255,0.8))"
                    }}
                    exit={{ 
                      pathLength: 0, 
                      opacity: 0 
                    }}
                    transition={{ 
                      pathLength: { duration: 0.6, ease: "easeOut" },
                      opacity: { duration: 0.3 },
                      filter: { duration: 0.3 }
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Label */}
              <AnimatePresence>
                {currentBoltIndex >= index && (
                  <motion.text
                    x={endX + (Math.cos((bolt.angle - 90) * Math.PI / 180) * 0.3)}
                    y={endY + (Math.sin((bolt.angle - 90) * Math.PI / 180) * 0.3)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff"
                    fontSize="0.08"
                    fontWeight="700"
                    fontFamily="monospace"
                    style={{ 
                      textTransform: "uppercase", 
                      letterSpacing: "0.02em"
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    {bolt.label}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>
    </div>
  );
} 