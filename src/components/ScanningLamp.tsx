import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const WORDS = [
  "Problem Solver",
  "AI Builder", 
  "Systems Thinker",
  "Creative Strategist",
  "Story-Driven PM"
];

const ScanningLamp: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera positioned for optimal view of vertical lamp
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 1, 0);

    // Renderer optimized for performance and aesthetics
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Better lighting to make lamp visible
    const ambient = new THREE.AmbientLight(0x222222, 0.3);
    scene.add(ambient);

    // Add a subtle directional light to highlight the lamp
    const directional = new THREE.DirectionalLight(0xffffff, 0.2);
    directional.position.set(2, 3, 2);
    scene.add(directional);

    // Lamp group - positioned to dominate the right side
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0, 0, 0); // Center the pivot point
    scene.add(lampGroup);

    // Ceiling mount (soft noir tone) - make it more visible
    const mountGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
    const mountMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf0f0f0,
      shininess: 60,
      specular: 0x444444
    });
    const mount = new THREE.Mesh(mountGeometry, mountMaterial);
    mount.position.y = 4.5; // Higher to dominate vertical space
    mount.castShadow = true;
    lampGroup.add(mount);

    // Long hanging cord/pipe (dominates vertical space)
    const cordGeometry = new THREE.CylinderGeometry(0.04, 0.04, 3, 8);
    const cordMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xe0e0e0,
      shininess: 40,
      specular: 0x333333
    });
    const cord = new THREE.Mesh(cordGeometry, cordMaterial);
    cord.position.y = 3;
    cord.castShadow = true;
    lampGroup.add(cord);

    // Lamp arm (vertical extension) - make it hang straight down
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
    const armMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5f5f5,
      shininess: 70,
      specular: 0x555555
    });
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.set(0, 1.6, 0);
    arm.castShadow = true;
    lampGroup.add(arm);

    // Lamp head (refined design) - point straight down
    const headGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.2, 8);
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5f5f5,
      shininess: 80,
      specular: 0x666666
    });
    const lampHead = new THREE.Mesh(headGeometry, headMaterial);
    lampHead.position.set(0, 1.2, 0);
    lampHead.castShadow = true;
    lampGroup.add(lampHead);

    // Light bulb (warm, subtle glow) - make it more visible
    const bulbGeometry = new THREE.SphereGeometry(0.15, 8, 6);
    const bulbMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xfff8e1,
      transparent: true,
      opacity: 0.9
    });
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.set(0, 1.2, 0);
    lampGroup.add(bulb);

    // SpotLight with precise cone for word revelation - point straight down
    const spotLight = new THREE.SpotLight(0xffffff, 3, 12, Math.PI / 8, 0.2, 1.5);
    spotLight.position.set(0, 1.2, 0);
    spotLight.target.position.set(0, -0.5, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.camera.fov = 20;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Subtle light beam visualization - point straight down
    const beamGeometry = new THREE.ConeGeometry(0.8, 2.5, 8, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(0, -0.05, 0);
    scene.add(beam);

    // Ground plane for shadows - pitch black
    const groundGeometry = new THREE.PlaneGeometry(12, 12);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x000000, // Pitch black
      shininess: 0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation state - scanning motion
    const clock = new THREE.Clock();
    let scanPosition = -1; // Start from left
    let scanDirection = 1; // Moving right
    let lastCenterTime = 0;
    const scanSpeed = 0.3; // Speed of scanning motion
    const scanRange = 1.2; // How far left/right to scan

    // Animation loop - left-to-right scanning motion
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = Math.min(clock.getDelta(), 0.016);

      // Smooth left-to-right scanning motion
      scanPosition += scanDirection * scanSpeed * deltaTime;
      
      // Reverse direction at edges
      if (scanPosition >= scanRange) {
        scanDirection = -1;
        scanPosition = scanRange;
      } else if (scanPosition <= -scanRange) {
        scanDirection = 1;
        scanPosition = -scanRange;
      }

      // Apply scanning motion to lamp group - rotate around Y-axis for left-right motion
      lampGroup.rotation.y = scanPosition * 0.3; // Convert position to rotation angle
      
      // Move spotlight with lamp - scanning movement
      spotLight.position.x = scanPosition * 0.8;
      spotLight.target.position.x = scanPosition * 0.8;
      beam.position.x = spotLight.position.x;

      // Word visibility logic - center detection
      const centerThreshold = 0.15; // Threshold for center detection
      const isNearCenter = Math.abs(scanPosition) < centerThreshold;
      
      if (isNearCenter) {
        // Full visibility when light crosses center
        setLightIntensity(1);
        // Change word when lamp crosses center
        if (elapsedTime - lastCenterTime > 4) { // Slightly longer timing for natural motion
          lastCenterTime = elapsedTime;
          setCurrentWordIndex((prev) => (prev + 1) % WORDS.length);
        }
      } else {
        // Gradual fade out - screen remains dark outside beam
        const fadeFactor = Math.max(0, 1 - Math.abs(scanPosition) / 0.4);
        setLightIntensity(fadeFactor * fadeFactor); // Quadratic fade for dramatic effect
      }

      // Dynamic light intensity for cinematic effect
      const targetIntensity = isNearCenter ? 3 : 0.3;
      spotLight.intensity = THREE.MathUtils.lerp(spotLight.intensity, targetIntensity, 0.08);

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
    <div
      ref={mountRef}
      className="relative w-full h-[400px] md:h-[520px] flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 0 64px 0 #ffffff12, 0 0 0 1px #ffffff06 inset" }}
    >
      {/* Word display with cinematic fade */}
      <div 
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none"
        style={{
          opacity: lightIntensity,
          transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        <div className="text-center">
          <h3 
            className="text-2xl md:text-3xl font-mono font-light text-white tracking-widest"
            style={{
              textShadow: `0 0 25px rgba(255,255,255,${lightIntensity * 0.8})`,
              filter: `blur(${(1 - lightIntensity) * 2.5}px)`,
              letterSpacing: "0.15em"
            }}
          >
            {WORDS[currentWordIndex]}
          </h3>
        </div>
      </div>

      {/* Subtle ambient glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(255,255,255,${lightIntensity * 0.06}) 0%, transparent 50%)`,
          transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      />
    </div>
  );
};

export default ScanningLamp; 