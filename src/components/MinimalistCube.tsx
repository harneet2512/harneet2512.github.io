import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const IDENTITY_PHRASES = [
  "Problem Solver",
  "AI Builder",
  "Systems Thinker",
  "Creative Strategist",
  "Story-Driven PM",
  "Technical Collaborator"
];

const MinimalistCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera positioned for optimal view
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4);

    // Renderer with clean settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Cube group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Create wireframe cube geometry
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Enhanced wireframe material for edges with animation
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00BFFF, // Electric Blue
      transparent: true,
      opacity: 0.9
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    cubeGroup.add(edgeLines);

    // Add additional glowing edge effect
    const glowEdges = new THREE.EdgesGeometry(cubeGeometry);
    const glowMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00BFFF,
      transparent: true,
      opacity: 0.3
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
      
      // Set up clean typography
      context.fillStyle = '#F5F5F5'; // Soft white
      context.font = 'bold 32px "DM Mono", "Space Grotesk", "SF Mono", monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Add text shadow for better visibility
      context.shadowColor = 'rgba(0, 191, 255, 0.5)';
      context.shadowBlur = 4;
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 1;
      
      // Draw text
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      return new THREE.CanvasTexture(canvas);
    };

    // Create materials for each face with text
    const materials = [];
    for (let i = 0; i < 6; i++) {
      const texture = createTextTexture(IDENTITY_PHRASES[i]);
      materials.push(new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      }));
    }

    // Create cube mesh with materials array
    const cube = new THREE.Mesh(cubeGeometry, materials);
    cubeGroup.add(cube);

    // Animation state
    const clock = new THREE.Clock();
    let faceDisplayTime = 0;
    let currentFaceIndex = 0;
    const faceDisplayDuration = 3; // 3 seconds per face
    let isRotating = false;
    let rotationStartTime = 0;
    const rotationDuration = 1; // 1 second for rotation
    let startRotation = 0;
    let targetRotation = 0;

    // Define rotation angles for each face (90 degrees apart)
    const faceRotations = [
      0,           // Problem Solver (front)
      Math.PI/2,   // AI Builder (right)
      Math.PI,     // Systems Thinker (back)
      -Math.PI/2,  // Creative Strategist (left)
    ];

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = Math.min(clock.getDelta(), 0.016);

      // Update face display timer
      faceDisplayTime += deltaTime;

      // Check if it's time to rotate to next face
      if (faceDisplayTime >= faceDisplayDuration && !isRotating) {
        faceDisplayTime = 0;
        currentFaceIndex = (currentFaceIndex + 1) % IDENTITY_PHRASES.length;
        
        // Start rotation
        startRotation = cubeGroup.rotation.y;
        targetRotation = faceRotations[currentFaceIndex % 4]; // Only 4 faces for now
        isRotating = true;
        rotationStartTime = elapsedTime;
        setCurrentPhrase(currentFaceIndex);
      }

      // Handle rotation animation
      if (isRotating) {
        const rotationProgress = (elapsedTime - rotationStartTime) / rotationDuration;
        
        if (rotationProgress >= 1) {
          // Rotation complete
          isRotating = false;
          cubeGroup.rotation.y = targetRotation;
        } else {
          // Smooth rotation
          const easedProgress = 1 - Math.pow(1 - rotationProgress, 3);
          cubeGroup.rotation.y = startRotation + (targetRotation - startRotation) * easedProgress;
        }
      }
      
      // Add gentle breathing scale effect
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
      cubeGroup.scale.setScalar(scale);
      
      // Animate glow effect
      glowLines.scale.setScalar(1.1 + Math.sin(elapsedTime * 3) * 0.05);
      glowLines.material.opacity = 0.3 + Math.sin(elapsedTime * 2) * 0.1;

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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-center">
          <h3 className="text-sm font-mono text-gray-400 tracking-wider">
            {IDENTITY_PHRASES[currentPhrase]}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MinimalistCube; 