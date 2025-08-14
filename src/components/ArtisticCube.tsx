import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const IDENTITY_PHRASES = [
  "Product Leader",
  "AI Builder",
  "Problem Solver",
  "Systems Thinker",
  "Creative Strategist",
  "Story-Driven PM"
];

const ArtisticCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // Camera with dynamic perspective
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3, 4); // Diagonal position for dynamic view
    camera.lookAt(0, 0, 0);

    // Renderer with smooth anti-aliasing
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Cube group with Z-elevation
    const cubeGroup = new THREE.Group();
    cubeGroup.position.z = 0.5; // Float above base plane
    scene.add(cubeGroup);

    // Create wireframe cube geometry
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Smooth wireframe material with light gray edges
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xBFBFBF, // Light gray
      transparent: true,
      opacity: 0.9
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    cubeGroup.add(edgeLines);

    // Add subtle glow effect around edges
    const glowEdges = new THREE.EdgesGeometry(cubeGeometry);
    const glowMaterial = new THREE.LineBasicMaterial({ 
      color: 0xBFBFBF,
      transparent: true,
      opacity: 0.2
    });
    const glowLines = new THREE.LineSegments(glowEdges, glowMaterial);
    glowLines.scale.setScalar(1.1);
    cubeGroup.add(glowLines);

    // Create text for each face
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    const createTextTexture = (text: string) => {
      if (!context) return null;
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set up elegant typography
      context.fillStyle = '#FFFFFF'; // Pure white
      context.font = '500 24px "SF Mono", "Monaco", "Inconsolata", monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Draw text
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      return new THREE.CanvasTexture(canvas);
    };

    // Create materials for each face with text
    const materials = [];
    for (let i = 0; i < 6; i++) {
      const texture = createTextTexture(IDENTITY_PHRASES[i % IDENTITY_PHRASES.length]);
      materials.push(new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      }));
    }

    // Create cube mesh with materials array
    const cube = new THREE.Mesh(cubeGeometry, materials);
    cubeGroup.add(cube);

    // Animation state
    const clock = new THREE.Clock();
    let rotationTime = 0;
    const rotationDuration = 6; // 6 seconds per full revolution

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = Math.min(clock.getDelta(), 0.016);

      // Update rotation time
      rotationTime += deltaTime;

      // Diagonal rotation with easing
      const rotationProgress = (rotationTime % rotationDuration) / rotationDuration;
      const easedProgress = 1 - Math.pow(1 - rotationProgress, 2); // Smooth easing
      
      // Apply diagonal rotation (both X and Y axes)
      cubeGroup.rotation.x = easedProgress * Math.PI * 2 * 0.3; // 30% X rotation
      cubeGroup.rotation.y = easedProgress * Math.PI * 2; // Full Y rotation

      // Determine which face is most front-facing
      const normalizedRotation = (cubeGroup.rotation.y % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const faceIndex = Math.floor((normalizedRotation / (Math.PI * 2)) * IDENTITY_PHRASES.length);
      setCurrentPhrase(faceIndex % IDENTITY_PHRASES.length);

      // Animate text opacity based on face orientation
      const frontFaceThreshold = 0.3; // How close to front-facing
      const isFrontFacing = Math.abs(normalizedRotation - (faceIndex * Math.PI * 2 / IDENTITY_PHRASES.length)) < frontFaceThreshold;
      
      // Update material opacity for text visibility
      materials.forEach((material, index) => {
        if (index < IDENTITY_PHRASES.length) {
          const isCurrentFace = index === (faceIndex % IDENTITY_PHRASES.length);
          material.opacity = isCurrentFace && isFrontFacing ? 0.9 : 0.1;
        }
      });

      // Animate glow effect
      const glowIntensity = 0.2 + Math.sin(elapsedTime * 2) * 0.1;
      glowLines.material.opacity = glowIntensity;
      glowLines.scale.setScalar(1.1 + Math.sin(elapsedTime * 3) * 0.05);

      // Subtle floating animation
      cubeGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.1;

      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* 3D Cube Container */}
      <div
        ref={mountRef}
        className="w-full h-full"
      />
      
      {/* Current Phrase Display */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-center">
          <h3 className="text-sm font-mono text-gray-300 tracking-wider">
            {IDENTITY_PHRASES[currentPhrase]}
          </h3>
          <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ArtisticCube; 