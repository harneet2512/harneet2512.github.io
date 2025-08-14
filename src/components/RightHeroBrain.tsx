import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";

interface RightHeroBrainProps {
  autoPlay?: boolean;
  scale?: number;
  animationDelay?: number;
}

interface LightningLine {
  id: string;
  label: string;
  angle: number;
  delay: number;
}

const LIGHTNING_LINES: LightningLine[] = [
  { id: "user-pain", label: "USER PAIN", angle: 135, delay: 0 },
  { id: "signal-detection", label: "SIGNAL DETECTION", angle: 45, delay: 0.8 },
  { id: "tradeoff-radar", label: "TRADEOFF RADAR", angle: 0, delay: 1.6 },
  { id: "timing-instinct", label: "TIMING INSTINCT", angle: 315, delay: 2.4 },
  { id: "build-impact", label: "BUILD x IMPACT SENSE", angle: 225, delay: 3.2 }
];

// Reference Image Analysis Component
function ReferenceImageAnalyzer({ onGeometryReady }: { onGeometryReady: (geometry: THREE.BufferGeometry) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load the reference image
    image.onload = () => {
      // Set canvas size to match image
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw image to canvas
      ctx.drawImage(image, 0, 0);
      
      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Extract brain outline points
      const outlinePoints: THREE.Vector3[] = [];
      const step = 2; // Sample every 2 pixels for performance
      
      // Scan the image to find brain outline
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];
          
          // Detect brain outline (white/light pixels on dark background)
          if (r > 200 && g > 200 && b > 200 && a > 128) {
            // Convert to normalized coordinates
            const normalizedX = (x / canvas.width - 0.5) * 4;
            const normalizedY = (0.5 - y / canvas.height) * 4;
            const normalizedZ = 0;
            
            outlinePoints.push(new THREE.Vector3(normalizedX, normalizedY, normalizedZ));
          }
        }
      }
      
      // Create brain geometry from outline points
      if (outlinePoints.length > 0) {
        const geometry = createBrainGeometryFromPoints(outlinePoints);
        onGeometryReady(geometry);
      }
    };

    // Set image source
    image.src = '/trial__.png';
  }, [onGeometryReady]);

  return (
    <div style={{ display: 'none' }}>
      <canvas ref={canvasRef} />
      <img ref={imageRef} alt="Reference brain" />
    </div>
  );
}

// Create brain geometry from reference image points
function createBrainGeometryFromPoints(outlinePoints: THREE.Vector3[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  
  // Create a more detailed brain shape based on the reference image
  // This is a fallback geometry that matches typical brain anatomy
  const brainShape = [
    // Frontal lobe (front)
    new THREE.Vector3(-1.2, 0.8, 0), new THREE.Vector3(-0.8, 1.2, 0), new THREE.Vector3(0, 1.4, 0),
    new THREE.Vector3(0.8, 1.2, 0), new THREE.Vector3(1.2, 0.8, 0), new THREE.Vector3(1.4, 0.4, 0),
    
    // Parietal lobe (top)
    new THREE.Vector3(1.4, 0, 0), new THREE.Vector3(1.2, -0.4, 0), new THREE.Vector3(0.8, -0.8, 0),
    
    // Temporal lobe (side with indent)
    new THREE.Vector3(0.4, -1.0, 0), new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(-0.4, -1.0, 0),
    new THREE.Vector3(-0.8, -0.8, 0), new THREE.Vector3(-1.0, -0.4, 0), new THREE.Vector3(-1.2, 0, 0),
    
    // Occipital lobe (back)
    new THREE.Vector3(-1.4, 0.4, 0), new THREE.Vector3(-1.2, 0.8, 0),
    
    // Brain stem
    new THREE.Vector3(-0.4, -1.4, 0), new THREE.Vector3(0, -1.6, 0), new THREE.Vector3(0.4, -1.4, 0),
    new THREE.Vector3(0.4, -1.0, 0)
  ];
  
  // Create vertices for the brain surface
  const vertices: number[] = [];
  const indices: number[] = [];
  
  // Generate surface vertices with depth
  const depth = 0.3;
  for (let i = 0; i < brainShape.length; i++) {
    const point = brainShape[i];
    
    // Front face
    vertices.push(point.x, point.y, point.z + depth);
    // Back face
    vertices.push(point.x, point.y, point.z - depth);
  }
  
  // Create triangles to form the brain surface
  for (let i = 0; i < brainShape.length - 1; i++) {
    const base = i * 2;
    
    // Front face triangles
    indices.push(base, base + 1, (base + 2) % (brainShape.length * 2));
    indices.push(base + 1, (base + 3) % (brainShape.length * 2), (base + 2) % (brainShape.length * 2));
    
    // Back face triangles
    indices.push(base + 1, base, (base + 2) % (brainShape.length * 2));
    indices.push((base + 3) % (brainShape.length * 2), base + 1, (base + 2) % (brainShape.length * 2));
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}

// 3D Brain Component with Reference Image Analysis
function Brain3D({ isVisible, onHover }: { isVisible: boolean; onHover: (hovering: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [brainGeometry, setBrainGeometry] = useState<THREE.BufferGeometry | null>(null);

  // Handle geometry ready from reference image analysis
  const handleGeometryReady = useCallback((geometry: THREE.BufferGeometry) => {
    setBrainGeometry(geometry);
  }, []);

  // Brain animation frame
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      
      // Slow rotation (360° over 20s)
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  // Hover effects
  const handlePointerEnter = useCallback(() => {
    onHover(true);
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [onHover]);

  const handlePointerLeave = useCallback(() => {
    onHover(false);
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [onHover]);

  return (
    <>
      {/* Reference Image Analyzer */}
      <ReferenceImageAnalyzer onGeometryReady={handleGeometryReady} />
      
      {/* Brain Mesh */}
      {brainGeometry && (
        <mesh
          ref={meshRef}
          geometry={brainGeometry}
          position={[0, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]} // Side view profile
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <meshStandardMaterial
            ref={materialRef}
            color="#e8e8e8"
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
      )}
    </>
  );
}

// Particle System Component
function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create particle geometry
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true
    });
  }, []);

  // Particle animation
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={particleGeometry} material={particleMaterial} />
  );
}

// SVG Lightning Bolt Component
function LightningBolt({ 
  angle, 
  isVisible, 
  delay 
}: { 
  angle: number; 
  isVisible: boolean; 
  delay: number;
}) {
  const boltRef = useRef<SVGGElement>(null);
  const radius = 180; // Start 180px from brain center
  const boltLength = 120; // Extend 120px outward
  
  const startX = Math.cos((angle - 90) * Math.PI / 180) * radius;
  const startY = Math.sin((angle - 90) * Math.PI / 180) * radius;
  const endX = Math.cos((angle - 90) * Math.PI / 180) * (radius + boltLength);
  const endY = Math.sin((angle - 90) * Math.PI / 180) * (radius + boltLength);

  // Generate sharp zigzag lightning path
  const generateLightningPath = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    const segments = 4;
    let path = `M ${startX} ${startY}`;
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = startX + (endX - startX) * t;
      const y = startY + (endY - startY) * t;
      
      // Sharp angular variations
      const angleVariation = 30 * Math.sin(i * Math.PI * 1.7);
      const offsetX = angleVariation * Math.cos((angle + 90) * Math.PI / 180);
      const offsetY = angleVariation * Math.sin((angle + 90) * Math.PI / 180);
      
      path += ` L ${x + offsetX} ${y + offsetY}`;
    }
    
    return path;
  }, [angle]);

  useEffect(() => {
    if (boltRef.current && isVisible) {
      // Lightning bolt animation
      gsap.fromTo(boltRef.current, 
        { 
          opacity: 0, 
          scale: 0.5,
          filter: "drop-shadow(0 0 0px rgba(255,255,255,0))"
        },
        { 
          opacity: 1, 
          scale: 1,
          filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
          duration: 0.6,
          delay: delay,
          ease: "power2.out"
        }
      );
    }
  }, [isVisible, delay]);

  return (
    <g ref={boltRef} style={{ opacity: 0 }}>
      <path
        d={generateLightningPath(startX, startY, endX, endY)}
        stroke="#ffffff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))"
        }}
      />
    </g>
  );
}

// Typography Component
function Label({ 
  label, 
  angle, 
  isVisible, 
  delay 
}: { 
  label: string; 
  angle: number; 
  isVisible: boolean; 
  delay: number;
}) {
  const radius = 220; // Position labels 220px from brain center
  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

  return (
    <motion.text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#ffffff"
      fontSize="16"
      fontWeight="700"
      fontFamily="Inter, Helvetica Neue, sans-serif"
      style={{ 
        textTransform: "uppercase", 
        letterSpacing: "1.5px"
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8 
      }}
      transition={{ 
        duration: 0.5, 
        delay: delay + 0.5, // Fade in 0.5s after lightning
        ease: "easeOut"
      }}
    >
      {label}
    </motion.text>
  );
}

export default function RightHeroBrain({ 
  autoPlay = true, 
  scale = 1, 
  animationDelay = 0 
}: RightHeroBrainProps) {
  const [currentLightningIndex, setCurrentLightningIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();
  const gsapTimelineRef = useRef<gsap.core.Timeline>();
  const brainRef = useRef<HTMLDivElement>(null);

  // Advanced animation sequence with GSAP Timeline
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setCurrentLightningIndex(0);

    // Clear any existing timeline
    if (gsapTimelineRef.current) {
      gsapTimelineRef.current.kill();
    }

    // Create new GSAP timeline
    gsapTimelineRef.current = gsap.timeline();

    // Brain entrance animation
    if (brainRef.current) {
      gsapTimelineRef.current.fromTo(brainRef.current, 
        { 
          opacity: 0, 
          scale: 0,
          y: 50
        },
        { 
          opacity: 1, 
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        }
      );
    }

    // Lightning bolt sequence
    LIGHTNING_LINES.forEach((_, index) => {
      setTimeout(() => {
        setCurrentLightningIndex(index);
      }, (index * 800) + animationDelay * 1000 + 1500); // Start after brain entrance
    });

    // Reset after animation completes
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentLightningIndex(-1);
    }, (LIGHTNING_LINES.length * 800) + 2000 + animationDelay * 1000);
  }, [animationDelay]);

  useEffect(() => {
    if (!autoPlay) return;

    // Start initial animation
    startAnimation();

    // Set up loop every 8 seconds
    animationRef.current = setInterval(startAnimation, 8000);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      if (gsapTimelineRef.current) {
        gsapTimelineRef.current.kill();
      }
    };
  }, [autoPlay, startAnimation]);

  // Loading state management
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full relative bg-black flex items-center justify-center">
        <div className="text-white font-mono text-sm">Loading Brain...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      {/* 3D Canvas for Brain */}
      <div 
        ref={brainRef}
        className="absolute inset-0 w-full h-full"
        style={{ transform: `scale(${scale})` }}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting Setup */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Brain Component */}
          <Brain3D 
            isVisible={isAnimating} 
            onHover={setIsHovering}
          />
          
          {/* Particle System */}
          <ParticleSystem />
          
          {/* Camera Controls */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* SVG Overlay for Lightning and Text */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 800"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Lightning bolts and labels positioned around brain */}
        <g transform="translate(400, 400)">
          {LIGHTNING_LINES.map((lightning, index) => (
            <g key={lightning.id}>
              <LightningBolt
                angle={lightning.angle}
                isVisible={isAnimating && currentLightningIndex >= index}
                delay={lightning.delay}
              />
              <Label
                label={lightning.label}
                angle={lightning.angle}
                isVisible={isAnimating && currentLightningIndex >= index}
                delay={lightning.delay}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Hover State Indicator */}
      {isHovering && (
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
          <span className="text-white text-sm font-mono">Brain Active</span>
        </div>
      )}
    </div>
  );
} 