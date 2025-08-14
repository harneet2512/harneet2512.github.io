import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface SpiderSenseLine {
  id: string;
  label: string;
  arcAngle: number; // angle in radians for arc placement
}

// Arc for 6 labels: -60, -36, -12, 12, 36, 60 degrees
const LABEL_ARC = [
  -60, -36, -12, 12, 36, 60
].map((deg) => (deg * Math.PI) / 180);

const LABELS = [
  'USER PAIN',
  'SIGNAL DETECTION',
  'TRADEOFF RADAR',
  'TIMING INSTINCT',
  'NARRATIVE FIT',
  'BUILD × IMPACT SENSE',
];

export function SpiderVerseBrain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const brainMeshRef = useRef<THREE.Mesh | null>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);

  const spiderSenseLines: SpiderSenseLine[] = LABELS.map((label, i) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label,
    arcAngle: LABEL_ARC[i],
  }));

  // Create canvas grain overlay
  const createGrainOverlay = () => {
    const canvas = grainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 256;
    canvas.height = 256;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255 * 0.1;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  };

  // Create a symmetrical, ellipsoid, low-poly brain with front/sides folds
  const createBrainGeometry = () => {
    const geometry = new THREE.IcosahedronGeometry(1, 2); // low-poly base
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      // Make ellipsoid: wider (x), less deep (z), taller (y)
      x *= 1.2;
      y *= 1.1;
      z *= 0.7;
      // Add folds only to front/sides (not top)
      const frontness = Math.max(0, 1 - Math.abs(y)); // less on top/bottom
      const fold = Math.sin(x * 3) * Math.cos(z * 4) * 0.13 * frontness;
      x += fold;
      z += fold * 0.7;
      pos.setXYZ(i, x, y, z);
    }
    geometry.computeVertexNormals();
    return geometry;
  };

  // Brain flicker effect
  const triggerBrainFlicker = () => {
    if (isFlickering) return;
    setIsFlickering(true);
    if (brainMeshRef.current) {
      const material = brainMeshRef.current.material as THREE.MeshLambertMaterial;
      gsap.to(material, {
        opacity: 0.3,
        duration: 0.05,
        repeat: 3,
        yoyo: true,
        ease: "steps(2)",
        onComplete: () => {
          material.opacity = 0.8;
          setIsFlickering(false);
        }
      });
    }
  };

  // Three.js scene setup
  useEffect(() => {
    if (!containerRef.current) return;
    createGrainOverlay();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3.2); // front view
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;
    // Brain mesh
    const geometry = createBrainGeometry();
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
    });
    const brainMesh = new THREE.Mesh(geometry, material);
    brainMesh.castShadow = false;
    brainMesh.receiveShadow = false;
    brainMeshRef.current = brainMesh;
    scene.add(brainMesh);
    // Lighting: flat, frontal
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(0, 0, 5);
    scene.add(dirLight);
    containerRef.current.appendChild(renderer.domElement);
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (brainMeshRef.current) {
        // Side-to-side Y rotation (±10°)
        brainMeshRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.17;
        // No X/Z rotation (front view)
        brainMeshRef.current.rotation.x = 0;
        brainMeshRef.current.rotation.z = 0;
        // Sine float
        brainMeshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.08;
      }
      renderer.render(scene, camera);
    };
    animate();
    // Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Animate labels and lines
  useEffect(() => {
    spiderSenseLines.forEach((line, index) => {
      const labelElement = document.getElementById(`spider-label-${line.id}`);
      if (labelElement) {
        const split = new SplitText(labelElement, { type: "chars" });
        gsap.fromTo(split.chars,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            delay: index * 0.1,
            stagger: 0.05,
            ease: "steps(6)"
          }
        );
      }
      // Animate main line
      const lineElement = document.getElementById(`spider-line-${line.id}-0`);
      if (lineElement) {
        gsap.fromTo(lineElement,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            delay: 0.5 + index * 0.1,
            ease: "steps(8)",
            onComplete: () => {
              gsap.to(lineElement, {
                x: "+=2",
                duration: 0.1,
                repeat: -1,
                yoyo: true,
                ease: "steps(2)"
              });
            }
          }
        );
      }
    });
    // Brain appearance animation
    if (brainMeshRef.current) {
      const material = brainMeshRef.current.material as THREE.MeshLambertMaterial;
      material.opacity = 0;
      gsap.to(material, {
        opacity: 0.8,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
        onComplete: () => {
          triggerBrainFlicker();
        }
      });
    }
  }, []);

  // Label hover
  const handleLabelHover = (labelId: string) => {
    setHoveredLabel(labelId);
    // Pulse main line
    const lineElement = document.getElementById(`spider-line-${labelId}-0`);
    if (lineElement) {
      gsap.to(lineElement, {
        scale: 1.2,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "steps(2)"
      });
    }
    // Bounce label
    const labelElement = document.getElementById(`spider-label-${labelId}`);
    if (labelElement) {
      gsap.to(labelElement, {
        y: -6,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "steps(2)"
      });
    }
    triggerBrainFlicker();
  };

  // Mouse tracking for hover flicker
  useEffect(() => {
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    if (containerRef.current) {
      containerRef.current.addEventListener('mouseenter', handleMouseEnter);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Arc layout for labels/lines
  const arcRadius = 140; // px from center
  const centerX = 50;
  const centerY = 54;

  return (
    <div className="relative w-full h-full">
      {/* Three.js Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {/* Canvas Grain Overlay */}
      <canvas
        ref={grainCanvasRef}
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==)',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay'
        }}
      />
      {/* Labels and Lines in Arc */}
      {spiderSenseLines.map((line, i) => {
        // Arc position for label
        const x = centerX + arcRadius * Math.sin(line.arcAngle);
        const y = centerY - arcRadius * Math.cos(line.arcAngle);
        // Start/end for line (SVG in px)
        const lineStart = { x: 50, y: 62 };
        const lineEnd = { x, y: y + 2 };
        // Jagged path (3-4 segments)
        const jag = (sx: number, sy: number, ex: number, ey: number) => {
          const mx1 = sx + (ex - sx) * 0.33 + (Math.random() - 0.5) * 8;
          const my1 = sy + (ey - sy) * 0.33 + (Math.random() - 0.5) * 8;
          const mx2 = sx + (ex - sx) * 0.66 + (Math.random() - 0.5) * 8;
          const my2 = sy + (ey - sy) * 0.66 + (Math.random() - 0.5) * 8;
          return `M${sx},${sy} L${mx1},${my1} L${mx2},${my2} L${ex},${ey}`;
        };
        return (
          <div key={line.id} className="absolute inset-0 pointer-events-none">
            {/* Label */}
            <div
              id={`spider-label-${line.id}`}
              className={`absolute font-mono text-white text-base font-bold tracking-wider cursor-pointer pointer-events-auto select-none ${
                hoveredLabel === line.id ? 'scale-110' : ''
              }`}
              style={{
                top: `${y}%`,
                left: `${x}%`,
                transform: `translate(-50%, -50%)`,
                letterSpacing: '0.04em',
                fontFamily: 'monospace, Comic Sans MS, monospace',
                textShadow: 'none',
              }}
              onMouseEnter={() => handleLabelHover(line.id)}
              onMouseLeave={() => setHoveredLabel(null)}
            >
              {line.label}
            </div>
            {/* Jagged Spider-Sense Lines (3 layers) */}
            {[0, 1, 2].map((layer) => (
              <svg
                key={layer}
                id={`spider-line-${line.id}-${layer}`}
                className="absolute left-0 top-0"
                width="100%" height="100%"
                style={{
                  pointerEvents: 'none',
                  opacity: 0.7 - layer * 0.2,
                  zIndex: 1,
                }}
              >
                <path
                  d={jag(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y)}
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        );
      })}
    </div>
  );
} 