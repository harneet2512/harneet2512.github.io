import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const IDENTITY_PHRASES = [
  "Product Leader",
  "Problem Solver",
  "Story-Driven PM",
  "Systems Thinker",
  "AI Builder"
];

const ModernCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // No background

    // Camera with isometric perspective
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3, 2, 3); // Angled position for isometric view
    camera.lookAt(0, 0, 0);

    // Renderer with clean settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Cube group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Create wireframe cube geometry
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Thin wireframe material
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xCCCCCC, // Light gray
      transparent: true,
      opacity: 0.8
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    cubeGroup.add(edgeLines);

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
      context.fillStyle = '#FFFFFF'; // White text
      context.font = '400 28px "Inter", "SF Pro Display", "Segoe UI", sans-serif';
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

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = Math.min(clock.getDelta(), 0.016);

      // Update face display timer
      faceDisplayTime += deltaTime;

      // Check if it's time to rotate to next face
      if (faceDisplayTime >= faceDisplayDuration) {
        faceDisplayTime = 0;
        currentFaceIndex = (currentFaceIndex + 1) % IDENTITY_PHRASES.length;
        setCurrentPhrase(currentFaceIndex);
      }

      // Simple rotation - rotate to show different faces
      const rotationSpeed = 0.3; // Slow rotation speed
      cubeGroup.rotation.y = elapsedTime * rotationSpeed;

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
          <h3 className="text-sm font-sans text-gray-300 tracking-wide">
            {IDENTITY_PHRASES[currentPhrase]}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ModernCube; 