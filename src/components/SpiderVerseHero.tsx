import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Brain Component
function Brain() {
  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Simple brain shape using SVG */}
      <motion.path
        d="M100 40 C80 40 60 60 60 80 C60 100 80 120 100 120 C120 120 140 100 140 80 C140 60 120 40 100 40 Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="2"
        animate={{ 
          rotateY: [0, 360],
          y: [0, -5, 0]
        }}
        transition={{ 
          rotateY: { repeat: Infinity, duration: 20, ease: "linear" },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
      />
      <motion.path
        d="M100 120 C80 120 60 140 60 160 C60 180 80 200 100 200 C120 200 140 180 140 160 C140 140 120 120 100 120 Z"
        fill="#f0f0f0"
        stroke="#ffffff"
        strokeWidth="2"
      />
    </motion.svg>
  );
}

// Hand-drawn Spider-Sense Line Component
function SpiderSenseLine({ 
  start, 
  end, 
  delay = 0,
  onHover 
}: { 
  start: [number, number], 
  end: [number, number], 
  delay?: number,
  onHover?: () => void 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const generateJaggedPath = (start: [number, number], end: [number, number], segments: number) => {
    const points: [number, number][] = [start];
    const dx = (end[0] - start[0]) / segments;
    const dy = (end[1] - start[1]) / segments;
    
    for (let i = 1; i < segments; i++) {
      const x = start[0] + dx * i + (Math.random() - 0.5) * 15;
      const y = start[1] + dy * i + (Math.random() - 0.5) * 15;
      points.push([x, y]);
    }
    
    points.push(end);
    return points;
  };

  const jaggedPoints = generateJaggedPath(start, end, 8);
  const pathData = `M ${jaggedPoints.map(p => p.join(',')).join(' L ')}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: delay,
        duration: 0.6,
        ease: [0.5, 0, 0.5, 1]
      }}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => {
        setIsHovered(true);
        onHover?.();
      }}
      onHoverEnd={() => setIsHovered(false)}
      className="spider-sense-line"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      {/* Multiple offset paths for frame echo effect */}
      {[0, 1, 2].map((layer) => (
        <svg
          key={layer}
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            animation: isHovered ? 'jitter 0.3s infinite steps(8)' : 'none',
            opacity: 0.7 - layer * 0.2
          }}
        >
          <path
            d={pathData}
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: `translate(${layer * 1.5}px, ${layer * 1.5}px)`
            }}
          />
        </svg>
      ))}
    </motion.div>
  );
}

// Comic-style Label Component
function ComicLabel({ 
  text, 
  x, 
  y, 
  delay = 0,
  onHover 
}: { 
  text: string, 
  x: string, 
  y: string, 
  delay?: number,
  onHover?: () => void 
}) {
  const [displayText, setDisplayText] = useState('');

  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [text]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        fontFamily: 'monospace, Comic Sans MS, monospace',
        fontWeight: 'bold',
        fontSize: 'clamp(12px, 2vw, 18px)',
        color: '#ffffff',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        pointerEvents: 'auto'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: delay,
        duration: 0.5,
        ease: [0.5, 0, 0.5, 1]
      }}
      whileHover={{ 
        y: -4,
        transition: { type: "spring", stiffness: 300 }
      }}
      onHoverStart={onHover}
    >
      {displayText}
    </motion.div>
  );
}

export default function SpiderVerseHero() {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const labels = [
    { id: 'user-pain', text: 'USER PAIN', x: '15%', y: '20%' },
    { id: 'signal-detection', text: 'SIGNAL DETECTION', x: '85%', y: '20%' },
    { id: 'build-impact', text: 'BUILD × IMPACT SENSE', x: '15%', y: '50%' },
    { id: 'tradeoff-radar', text: 'TRADEOFF RADAR', x: '85%', y: '50%' },
    { id: 'narrative-fit', text: 'NARRATIVE FIT', x: '25%', y: '80%' },
    { id: 'timing-instinct', text: 'TIMING INSTINCT', x: '75%', y: '80%' }
  ];

  const lines = [
    { start: [50, 35] as [number, number], end: [15, 20] as [number, number] },
    { start: [50, 35] as [number, number], end: [85, 20] as [number, number] },
    { start: [50, 50] as [number, number], end: [15, 50] as [number, number] },
    { start: [50, 50] as [number, number], end: [85, 50] as [number, number] },
    { start: [50, 65] as [number, number], end: [25, 80] as [number, number] },
    { start: [50, 65] as [number, number], end: [75, 80] as [number, number] }
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Simple SVG Brain */}
      <Brain />

      {/* Spider-Sense Lines */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
      }}>
        {lines.map((line, index) => (
          <SpiderSenseLine
            key={index}
            start={line.start}
            end={line.end}
            delay={1 + index * 0.1}
            onHover={() => setHoveredLabel(labels[index]?.id || null)}
          />
        ))}
      </div>

      {/* Comic Labels */}
      <AnimatePresence>
        {labels.map((label, index) => (
          <ComicLabel
            key={label.id}
            text={label.text}
            x={label.x}
            y={label.y}
            delay={0.5 + index * 0.1}
            onHover={() => setHoveredLabel(label.id)}
          />
        ))}
      </AnimatePresence>

      {/* CSS for jitter animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes jitter {
            0% { transform: translate(0px, 0px); }
            25% { transform: translate(1px, -1px); }
            50% { transform: translate(-1px, 1px); }
            75% { transform: translate(1px, 1px); }
            100% { transform: translate(0px, 0px); }
          }
          
          .spider-sense-line svg {
            filter: drop-shadow(0 0 1px rgba(255,255,255,0.3));
          }
        `
      }} />
    </div>
  );
} 