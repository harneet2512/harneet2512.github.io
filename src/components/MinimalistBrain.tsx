import { motion } from "framer-motion";
import React from "react";

const ProductSensesBrain = () => {
  // Simplified brain strokes extracted from the uploaded SVG
  // Transformed to white strokes with clean, minimalist approach
  const brainStrokes = [
    // Main brain outline (simplified from the uploaded SVG)
    "M 200 80 C 250 85, 280 105, 290 130 C 295 155, 290 180, 280 205 C 270 230, 250 250, 220 255 C 190 260, 170 250, 160 230 C 150 210, 155 190, 165 170 C 175 150, 185 130, 200 80",
    
    // Frontal lobe fold (from uploaded SVG path data)
    "M 220 100 C 235 105, 245 115, 250 125 C 245 135, 235 145, 220 150",
    
    // Parietal lobe fold
    "M 240 130 C 250 135, 255 145, 250 155 C 245 165, 235 175, 225 180",
    
    // Temporal lobe fold
    "M 230 160 C 240 165, 245 175, 240 185 C 235 195, 225 205, 215 210",
    
    // Occipital lobe fold
    "M 210 190 C 220 195, 225 205, 220 215 C 215 225, 205 235, 195 240",
    
    // Brain stem
    "M 195 240 C 190 250, 185 260, 180 270 C 175 280, 170 290, 165 300",
    
    // Central sulcus (main fold)
    "M 220 120 C 215 130, 215 140, 220 150 C 225 140, 225 130, 220 120",
    
    // Additional cortical fold
    "M 210 140 C 220 145, 225 155, 220 165 C 215 175, 205 185, 195 190"
  ];

  // Jagged lightning lines with 3-5 angled segments
  const senseLines = [
    // Top-left - BUILD × IMPACT SENSE
    "M 220 100 L 180 95 L 150 80 L 120 70 L 100 60",
    
    // Mid-left - USER PAIN
    "M 200 140 L 160 145 L 130 140 L 100 135 L 80 130",
    
    // Bottom-left - SIGNAL DETECTION
    "M 190 220 L 150 230 L 120 240 L 90 250 L 70 260",
    
    // Top-right - NARRATIVE FIT
    "M 240 120 L 280 115 L 310 105 L 340 95 L 360 85",
    
    // Mid-right - TIMING INSTINCT
    "M 250 160 L 290 155 L 320 145 L 350 135 L 370 125",
    
    // Bottom-right - TRADEOFF RADAR
    "M 230 220 L 270 225 L 300 235 L 330 245 L 350 255"
  ];

  // Label data with positioning
  const senseLabels = [
    { text: "BUILD × IMPACT SENSE", classes: "top-8 left-4" },
    { text: "USER PAIN", classes: "top-1/3 left-4 -translate-y-1/2" },
    { text: "SIGNAL DETECTION", classes: "bottom-1/3 left-4 -translate-y-1/2" },
    { text: "NARRATIVE FIT", classes: "top-8 right-4 text-right" },
    { text: "TIMING INSTINCT", classes: "top-1/2 right-4 -translate-y-1/2 text-right" },
    { text: "TRADEOFF RADAR", classes: "bottom-1/4 right-4 text-right" }
  ];

  return (
    <div className="relative w-full aspect-[4/3] max-w-[680px] mx-auto">
      {/* Faint halftone dot radial background */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <defs>
            <radialGradient id="halftone" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="0.08" />
              <stop offset="70%" stopColor="white" stopOpacity="0.03" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#halftone)" />
          <rect width="400" height="300" fill="url(#dots)" />
        </svg>
      </div>

      {/* Main SVG Container */}
      <motion.svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 400 300"
        initial="hidden"
        animate="visible"
      >
        {/* Brain Group with breathing animation - EXACTLY as specified */}
        <motion.g
          animate={{ 
            scale: [1, 1.01, 1],
            y: [0, -2, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Brain strokes - transformed from uploaded SVG to white strokes */}
          {brainStrokes.map((stroke, index) => (
            <motion.path
              key={index}
              d={stroke}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                delay: index * 0.1
              }}
            />
          ))}
        </motion.g>

        {/* Spider-Sense Lightning Lines with comic impact */}
        {senseLines.map((linePath, index) => (
          <g key={index}>
            {/* Faint offset duplicate for comic motion blur */}
            <motion.path
              d={linePath}
              stroke="white"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
              transform="translate(2, 2)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                delay: 1.5 + index * 0.15
              }}
            />
            
            {/* Main lightning line with hover micro-jitter */}
            <motion.path
              d={linePath}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                delay: 1.5 + index * 0.15
              }}
              whileHover={{
                rotate: [-1, 1, -1],
                scale: [1, 1.02, 1],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 0.2,
                },
              }}
            />
          </g>
        ))}
      </motion.svg>

      {/* Product Senses Labels */}
      {senseLabels.map((label, index) => (
        <motion.div
          key={label.text}
          className={`absolute text-white font-mono uppercase tracking-wide text-sm font-light ${label.classes}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 2.5 + index * 0.2,
            ease: "easeOut",
          }}
          whileHover={{
            scale: 1.05,
            filter: "brightness(1.1)",
            transition: { duration: 0.2 }
          }}
        >
          {label.text}
        </motion.div>
      ))}
    </div>
  );
};

export default ProductSensesBrain; 