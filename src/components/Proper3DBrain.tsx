import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface LightningBolt {
  id: string;
  label: string;
  angle: number;
  delay: number;
}

const LIGHTNING_BOLTS: LightningBolt[] = [
  {
    id: "user-pain",
    label: "USER PAIN",
    angle: 135, // Top-left
    delay: 0
  },
  {
    id: "signal-detection", 
    label: "SIGNAL DETECTION",
    angle: 45, // Top-right
    delay: 0.8
  },
  {
    id: "tradeoff-radar",
    label: "TRADEOFF RADAR", 
    angle: 0, // Right
    delay: 1.6
  },
  {
    id: "timing-instinct",
    label: "TIMING INSTINCT",
    angle: 315, // Bottom-right
    delay: 2.4
  },
  {
    id: "build-impact",
    label: "BUILD x IMPACT SENSE",
    angle: 225, // Bottom-left
    delay: 3.2
  }
];

// Create proper 3D brain geometry that matches reference image
const createBrainGeometry = (): THREE.BufferGeometry => {
  const geometry = new THREE.SphereGeometry(2, 16, 12); // Lower subdivision for cleaner wireframe
  const positions = geometry.attributes.position.array;
  
  // Modify vertices to create brain shape from reference image
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    // Apply brain deformations to match reference image:
    
    // Frontal lobe (front of brain) - wider and higher
    if (z > 0.3) {
      positions[i] *= 1.5;       // wider front
      positions[i + 1] *= 1.3;   // higher front
      positions[i + 2] *= 1.2;   // slightly more forward
    }
    
    // Parietal lobe (top) - maintain height
    if (y > 0.8 && z > -0.5) {
      positions[i] *= 1.2;       // slightly wider top
      positions[i + 1] *= 1.0;   // maintain height
    }
    
    // Temporal lobe indentation (side dips) - more pronounced
    if (Math.abs(x) > 0.8 && y < 0.2 && z > -0.8) {
      positions[i + 1] *= 0.5;   // deeper temporal dip
      positions[i] *= 0.85;      // slightly narrower at temporal
    }
    
    // Occipital lobe (back) - rounder back
    if (z < -0.8 && y > -0.5) {
      positions[i] *= 0.85;      // narrower back
      positions[i + 2] *= 0.7;   // less deep back
    }
    
    // Brain stem (bottom center) - more defined
    if (y < -1.0 && z < -0.5 && Math.abs(x) < 0.5) {
      positions[i] *= 0.3;       // narrow stem
      positions[i + 1] *= 0.6;   // shorter stem
      positions[i + 2] *= 0.5;   // less deep stem
    }
    
    // Cerebellum (back bottom) - more defined
    if (y < -0.5 && z < -1.0) {
      positions[i] *= 0.7;       // narrower cerebellum
      positions[i + 1] *= 0.8;   // maintain height
    }
    
    // Add subtle folds and wrinkles
    const fold = Math.sin(x * 8) * Math.cos(y * 6) * 0.1;
    positions[i] += fold;
    positions[i + 1] += fold * 0.5;
  }
  
  geometry.computeVertexNormals();
  return geometry;
};

// Manually define brain outline points for clean brain shape
const createBrainOutline = (): THREE.Group => {
  const group = new THREE.Group();
  
  // Brain outline material
  const outlineMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff, 
    linewidth: 2,
    transparent: true,
    opacity: 0.9
  });
  
  // Main brain outline - side profile view
  const brainOutlinePoints = [
    // Frontal lobe outline (front of brain)
    new THREE.Vector3(-1.8, 1.2, 1.4),   // front top
    new THREE.Vector3(-2.2, 0.6, 1.6),   // front upper middle
    new THREE.Vector3(-2.0, 0.0, 1.5),   // front middle
    new THREE.Vector3(-1.8, -0.4, 1.3),  // front lower middle
    new THREE.Vector3(-1.5, -0.8, 1.0),  // front bottom
    
    // Temporal lobe (side dip)
    new THREE.Vector3(-1.2, -1.0, 0.6),  // temporal dip start
    new THREE.Vector3(-0.8, -1.2, 0.3),  // temporal dip middle
    new THREE.Vector3(-0.4, -1.3, 0.1),  // temporal dip bottom
    
    // Brain stem (bottom center)
    new THREE.Vector3(0.0, -1.4, -0.2),  // stem start
    new THREE.Vector3(0.3, -1.6, -0.4),  // stem middle
    new THREE.Vector3(0.5, -1.8, -0.6),  // stem end
    
    // Cerebellum (back bottom)
    new THREE.Vector3(0.8, -1.2, -0.8),  // cerebellum start
    new THREE.Vector3(1.2, -0.8, -1.0),  // cerebellum middle
    new THREE.Vector3(1.5, -0.4, -1.1),  // cerebellum upper
    
    // Occipital lobe (back)
    new THREE.Vector3(1.8, 0.0, -1.2),   // back lower middle
    new THREE.Vector3(1.6, 0.4, -1.0),   // back middle
    new THREE.Vector3(1.4, 0.8, -0.8),   // back upper middle
    new THREE.Vector3(1.2, 1.2, -0.6),   // back top
    
    // Parietal lobe (top)
    new THREE.Vector3(0.8, 1.4, -0.2),   // top back
    new THREE.Vector3(0.4, 1.6, 0.2),    // top middle
    new THREE.Vector3(0.0, 1.6, 0.6),    // top front middle
    new THREE.Vector3(-0.4, 1.4, 1.0),   // top front
    new THREE.Vector3(-1.0, 1.2, 1.2),   // top front end
    new THREE.Vector3(-1.8, 1.2, 1.4),   // back to start (close loop)
  ];
  
  // Create main brain outline
  const brainOutlineGeometry = new THREE.BufferGeometry().setFromPoints(brainOutlinePoints);
  const brainOutline = new THREE.Line(brainOutlineGeometry, outlineMaterial);
  group.add(brainOutline);
  
  // Internal brain division lines (cerebral hemispheres)
  const internalLines = [
    // Central sulcus (major brain fold)
    [
      new THREE.Vector3(-1.2, 0.8, 0.8),
      new THREE.Vector3(-0.8, 0.4, 0.6),
      new THREE.Vector3(-0.4, 0.0, 0.4),
      new THREE.Vector3(0.0, -0.2, 0.2),
      new THREE.Vector3(0.4, -0.4, 0.0),
      new THREE.Vector3(0.8, -0.6, -0.2)
    ],
    // Lateral sulcus (temporal lobe separation)
    [
      new THREE.Vector3(-1.0, 0.2, 0.8),
      new THREE.Vector3(-0.6, -0.2, 0.6),
      new THREE.Vector3(-0.2, -0.6, 0.4),
      new THREE.Vector3(0.2, -0.8, 0.2),
      new THREE.Vector3(0.6, -1.0, 0.0)
    ],
    // Frontal lobe division
    [
      new THREE.Vector3(-1.6, 0.8, 1.0),
      new THREE.Vector3(-1.4, 0.4, 0.8),
      new THREE.Vector3(-1.2, 0.0, 0.6),
      new THREE.Vector3(-1.0, -0.4, 0.4)
    ]
  ];
  
  // Create internal brain lines
  internalLines.forEach(linePoints => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const internalLine = new THREE.Line(lineGeometry, outlineMaterial);
    internalLine.material.opacity = 0.6; // Slightly more transparent for internal lines
    group.add(internalLine);
  });
  
  return group;
};

// 3D Brain Component
function Brain3D({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outlineRef = useRef<THREE.Group>(null);
  const [brainGeometry] = useState(() => createBrainGeometry());
  const [brainOutline] = useState(() => createBrainOutline());

  // Brain animation frame
  useFrame((state) => {
    if (meshRef.current && outlineRef.current && isVisible) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      outlineRef.current.position.y = meshRef.current.position.y;
      
      // Slow rotation (360° over 30s)
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      outlineRef.current.rotation.y = meshRef.current.rotation.y;
    }
  });

  return (
    <group>
      {/* Custom brain outline - manually drawn lines */}
      <primitive object={brainOutline} ref={outlineRef} />
    </group>
  );
}

// Lightning Bolt Component
function LightningBolt({ 
  angle, 
  isVisible, 
  delay 
}: { 
  angle: number; 
  isVisible: boolean; 
  delay: number;
}) {
  const boltRef = useRef<THREE.Group>(null);
  const radius = 3.5; // Start 3.5 units from brain center
  const boltLength = 2.5; // Extend 2.5 units outward
  
  const startX = Math.cos((angle - 90) * Math.PI / 180) * radius;
  const startY = Math.sin((angle - 90) * Math.PI / 180) * radius;
  const endX = Math.cos((angle - 90) * Math.PI / 180) * (radius + boltLength);
  const endY = Math.sin((angle - 90) * Math.PI / 180) * (radius + boltLength);

  // Generate jagged lightning path
  const generateLightningPath = (): THREE.Vector3[] => {
    const segments = 4;
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const baseX = startX + (endX - startX) * t;
      const baseY = startY + (endY - startY) * t;
      
      // Sharp angular variations
      const angleVariation = 0.8 + Math.random() * 0.8; // 0.8-1.6 unit variation
      const perpendicularAngle = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;
      const offsetX = angleVariation * Math.cos(perpendicularAngle) * (Math.random() > 0.5 ? 1 : -1);
      const offsetY = angleVariation * Math.sin(perpendicularAngle) * (Math.random() > 0.5 ? 1 : -1);
      
      points.push(new THREE.Vector3(baseX + offsetX, baseY + offsetY, 0));
    }
    
    return points;
  };

  useEffect(() => {
    if (boltRef.current && isVisible) {
      // Lightning bolt animation
      boltRef.current.scale.set(0, 0, 0);
      boltRef.current.visible = true;
      
      // Animate scale to create "crack" effect
      const animate = () => {
        if (boltRef.current) {
          boltRef.current.scale.x += 0.1;
          boltRef.current.scale.y += 0.1;
          boltRef.current.scale.z += 0.1;
          
          if (boltRef.current.scale.x < 1) {
            requestAnimationFrame(animate);
          }
        }
      };
      
      setTimeout(() => {
        animate();
      }, delay * 1000);
    } else if (boltRef.current) {
      boltRef.current.visible = false;
    }
  }, [isVisible, delay]);

  const lightningPoints = generateLightningPath();
  const lightningGeometry = new THREE.BufferGeometry().setFromPoints(lightningPoints);

  return (
    <group ref={boltRef} visible={false}>
      <lineSegments geometry={lightningGeometry}>
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>
    </group>
  );
}

// Label Component
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
  const groupRef = useRef<THREE.Group>(null);
  const radius = 4.2; // Position labels 4.2 units from brain center
  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

  useEffect(() => {
    if (groupRef.current) {
      if (isVisible) {
        groupRef.current.visible = true;
        groupRef.current.scale.set(0.8, 0.8, 0.8);
        groupRef.current.position.set(x, y, 0);
        
        // Animate in
        const animate = () => {
          if (groupRef.current && groupRef.current.scale.x < 1) {
            groupRef.current.scale.x += 0.05;
            groupRef.current.scale.y += 0.05;
            groupRef.current.scale.z += 0.05;
            requestAnimationFrame(animate);
          }
        };
        
        setTimeout(() => {
          animate();
        }, delay * 1000 + 300);
      } else {
        groupRef.current.visible = false;
      }
    }
  }, [isVisible, delay, x, y]);

  return (
    <group ref={groupRef} visible={false}>
      <mesh>
        <planeGeometry args={[3, 0.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.8, 0.3]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export function Proper3DBrain() {
  const [currentBoltIndex, setCurrentBoltIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();

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
    
    // Loop every 10 seconds
    animationRef.current = setInterval(startLightningSequence, 10000);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      <Canvas
        camera={{ 
          position: [4, 0, 0], // Side profile view matching reference image
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.0}
        />
        
        {/* Brain Component */}
        <Brain3D isVisible={isAnimating} />
        
        {/* Lightning Bolts */}
        {LIGHTNING_BOLTS.map((bolt, index) => (
          <LightningBolt
            key={bolt.id}
            angle={bolt.angle}
            isVisible={isAnimating && currentBoltIndex >= index}
            delay={bolt.delay}
          />
        ))}
        
        {/* Labels */}
        {LIGHTNING_BOLTS.map((bolt, index) => (
          <Label
            key={`label-${bolt.id}`}
            label={bolt.label}
            angle={bolt.angle}
            isVisible={isAnimating && currentBoltIndex >= index}
            delay={bolt.delay}
          />
        ))}
        
        {/* Camera Controls - Disabled for fixed side view */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
} 