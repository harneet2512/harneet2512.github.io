import React from "react";
import { motion } from "framer-motion";

interface ProductSensesBrainProps {
  theme?: "dark" | "light";
  className?: string;
}

/**
 * ProductSensesBrain
 *
 * - Comic-style, front-facing, white brain with bold black outlines
 * - Animated with Framer Motion (breathing: scale + y float)
 * - SVG only, no image assets
 * - Accessible (role="img", aria-label)
 * - Responsive, premium, and modern
 *
 * Container suggestion:
 * <div className="flex justify-center items-center w-full h-full bg-black"> <ProductSensesBrain /> </div>
 */
export const ProductSensesBrain: React.FC<ProductSensesBrainProps> = ({ theme = "dark", className = "" }) => {
  const isDark = theme === "dark";
  // Gyri stroke color
  const stroke = isDark ? "#fff" : "#000";
  const outline = isDark ? "#fff" : "#000";
  const fill = "#fff";
  const shadow = isDark ? "drop-shadow-[0_0_10px_white]" : "drop-shadow-[0_0_10px_black]";

  // Gyri paths (mirrored for symmetry)
  const gyriPaths = [
    // Left hemisphere
    "M70,90 Q60,80 70,70 Q80,60 90,70 Q100,80 90,90 Q80,100 70,90", // upper
    "M75,110 Q65,105 75,95 Q85,85 95,95 Q105,105 95,110 Q85,115 75,110", // mid
    "M80,130 Q70,130 80,120 Q90,110 100,120 Q110,130 100,135 Q90,140 80,130", // lower
    // Right hemisphere (mirrored)
    "M130,90 Q140,80 130,70 Q120,60 110,70 Q100,80 110,90 Q120,100 130,90", // upper
    "M125,110 Q135,105 125,95 Q115,85 105,95 Q95,105 105,110 Q115,115 125,110", // mid
    "M120,130 Q130,130 120,120 Q110,110 100,120 Q90,130 100,135 Q110,140 120,130", // lower
  ];

  return (
    <motion.svg
      width="220"
      height="180"
      viewBox="0 0 220 180"
      className={`mx-auto ${shadow} ${className}`}
      role="img"
      aria-label="Breathing stylized brain"
      initial={{ scale: 1, y: 0 }}
      animate={{ scale: [1, 1.03, 1], y: [0, -6, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "block" }}
    >
      {/* Main brain outline: cartoon side view, left-facing */}
      <motion.path
        d="M60,90
          Q40,60 70,40
          Q90,20 130,35
          Q170,50 160,90
          Q200,110 150,130
          Q170,170 110,160
          Q80,170 80,140
          Q40,130 60,90
          Z"
        fill={fill}
        stroke={outline}
        strokeWidth={3.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={isDark ? "drop-shadow(0 0 8px #fff8)" : "drop-shadow(0 0 8px #0004)"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      {/* Gyri (brain folds), cartoon style, mostly horizontal/curved */}
      <motion.path
        d="M80,60 Q70,70 90,80"
        fill="none"
        stroke={outline}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
      />
      <motion.path
        d="M100,50 Q120,60 110,80"
        fill="none"
        stroke={outline}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.0, duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
      />
      <motion.path
        d="M120,60 Q140,70 130,90"
        fill="none"
        stroke={outline}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.1, duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
      />
      <motion.path
        d="M90,100 Q110,110 100,130"
        fill="none"
        stroke={outline}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
      />
      <motion.path
        d="M120,110 Q140,120 120,140"
        fill="none"
        stroke={outline}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.3, duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
      />
      {/* Brain stem (cerebellum), bottom right */}
      <motion.path
        d="M140,150 Q150,170 120,160"
        fill={fill}
        stroke={outline}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

export default ProductSensesBrain; 