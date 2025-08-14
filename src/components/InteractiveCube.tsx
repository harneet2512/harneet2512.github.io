import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface InteractiveCubeProps {
  phrases: string[]; // 6 phrases, one per face
  descriptions: string[]; // 6 descriptions, one per face
}

const FACE_COLORS = [
  "#00fff7", // front
  "#ec4899", // back
  "#38bdf8", // right
  "#a21caf", // left
  "#818cf8", // top
  "#f472b6", // bottom
];

const CUBE_SIZE = 3.2; // in Three.js units
const FONT_FAMILY = "'Fira Mono', 'Menlo', 'Consolas', 'monospace'";

const InteractiveCube: React.FC<InteractiveCubeProps> = ({ phrases, descriptions }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // For drag rotation
  const dragState = useRef({
    lastX: 0,
    lastY: 0,
    isDragging: false,
    rotationX: 0,
    rotationY: 0,
  });

  useEffect(() => {
    if (!mountRef.current) return;
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;
    setDimensions({ width, height });

    // Scene setup
    const scene = new THREE.Scene();
    // Radial gradient background (matte, no grid)
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = 512;
    bgCanvas.height = 512;
    const bgCtx = bgCanvas.getContext("2d")!;
    const grad = bgCtx.createRadialGradient(256, 256, 80, 256, 256, 256);
    grad.addColorStop(0, "#23272f");
    grad.addColorStop(1, "#000");
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, 512, 512);
    scene.background = new THREE.CanvasTexture(bgCanvas);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x18181b, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const point = new THREE.PointLight(0x00fff7, 1.2, 100);
    point.position.set(5, 5, 10);
    scene.add(point);
    const soft = new THREE.PointLight(0xffffff, 0.3, 100);
    soft.position.set(-5, -5, -10);
    scene.add(soft);

    // Cube geometry
    const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

    // Helper: create a canvas texture for each face
    function createFaceTexture(text: string, color: string, isHovered: boolean): THREE.Texture {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      // Glass/holo background
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.globalAlpha = 0.82;
      ctx.filter = "blur(1.5px)";
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, color + "33");
      grad.addColorStop(1, "#23272f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
      // Neon border
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = isHovered ? 48 : 28;
      ctx.lineWidth = isHovered ? 14 : 8;
      ctx.strokeStyle = color;
      ctx.strokeRect(24, 24, size - 48, size - 48);
      ctx.restore();
      // Glass highlight
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.ellipse(size/2, size/2.7, size/2.2, size/5, Math.PI/8, 0, 2*Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();
      // Text
      ctx.save();
      ctx.font = `${isHovered ? "bold 56px" : "bold 48px"} ${FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = color;
      ctx.shadowBlur = isHovered ? 32 : 16;
      ctx.fillStyle = "#aefeff";
      ctx.fillText(text, size / 2, size / 2);
      ctx.restore();
      return new THREE.CanvasTexture(canvas);
    }

    // Materials for each face (MeshPhysicalMaterial for glass-like effect)
    const materials = phrases.map((phrase, i) => {
      const texture = createFaceTexture(phrase, FACE_COLORS[i], hoveredFace === i);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        transparent: true,
        opacity: 0.93,
        transmission: 0.85, // glass effect
        thickness: 0.7,
        roughness: 0.08,
        metalness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        ior: 1.4,
        reflectivity: 0.22,
        specularIntensity: 0.7,
        color: new THREE.Color("#e0f7fa").lerp(new THREE.Color(FACE_COLORS[i]), 0.08),
        emissive: new THREE.Color(FACE_COLORS[i]),
        emissiveIntensity: hoveredFace === i ? 0.22 : 0.13,
      });
    });

    // Cube mesh
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Neon edges using LineSegments
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x00fff7,
      linewidth: 2,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    scene.add(edgeLines);

    // Glow effect (simple): add a slightly larger, transparent cube
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00fff7,
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide,
    });
    const glowCube = new THREE.Mesh(
      new THREE.BoxGeometry(CUBE_SIZE * 1.13, CUBE_SIZE * 1.13, CUBE_SIZE * 1.13),
      glowMaterial
    );
    scene.add(glowCube);

    // Animation state
    let autoRotX = -0.28;
    let autoRotY = 0;
    let lastTime = performance.now();
    let isUserInteracting = false;
    let pulse = 0;

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (!isUserInteracting) {
        autoRotY += delta * 0.5; // Y axis
        autoRotX += delta * 0.13; // X axis
      }
      // Pulse effect for hovered face
      if (hoveredFace !== null) {
        pulse = Math.abs(Math.sin(now * 0.004)) * 0.08 + 1.0;
        cube.scale.set(
          hoveredFace !== null ? pulse : 1,
          hoveredFace !== null ? pulse : 1,
          hoveredFace !== null ? pulse : 1
        );
      } else {
        cube.scale.set(1, 1, 1);
      }
      cube.rotation.y = autoRotY + dragState.current.rotationY;
      cube.rotation.x = autoRotX + dragState.current.rotationX;
      glowCube.rotation.copy(cube.rotation);
      edgeLines.rotation.copy(cube.rotation);
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      setDimensions({ width, height });
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    // Mouse/touch controls
    function onPointerDown(e: MouseEvent | TouchEvent) {
      isUserInteracting = true;
      dragState.current.isDragging = true;
      if (e instanceof MouseEvent) {
        dragState.current.lastX = e.clientX;
        dragState.current.lastY = e.clientY;
      } else {
        dragState.current.lastX = e.touches[0].clientX;
        dragState.current.lastY = e.touches[0].clientY;
      }
    }
    function onPointerMove(e: MouseEvent | TouchEvent) {
      if (!dragState.current.isDragging) return;
      let clientX, clientY;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      const dx = clientX - dragState.current.lastX;
      const dy = clientY - dragState.current.lastY;
      dragState.current.lastX = clientX;
      dragState.current.lastY = clientY;
      dragState.current.rotationY += dx * 0.01;
      dragState.current.rotationX += dy * 0.01;
    }
    function onPointerUp() {
      isUserInteracting = false;
      dragState.current.isDragging = false;
    }
    renderer.domElement.addEventListener("mousedown", onPointerDown);
    renderer.domElement.addEventListener("mousemove", onPointerMove);
    renderer.domElement.addEventListener("mouseup", onPointerUp);
    renderer.domElement.addEventListener("mouseleave", onPointerUp);
    renderer.domElement.addEventListener("touchstart", onPointerDown);
    renderer.domElement.addEventListener("touchmove", onPointerMove);
    renderer.domElement.addEventListener("touchend", onPointerUp);

    // Raycast for hover/tooltip
    function onPointerHover(e: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cube);
      if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex! / 2);
        setHoveredFace(faceIndex);
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      } else {
        setHoveredFace(null);
        setTooltipPos(null);
      }
    }
    renderer.domElement.addEventListener("mousemove", onPointerHover);
    renderer.domElement.addEventListener("mouseleave", () => {
      setHoveredFace(null);
      setTooltipPos(null);
    });

    // Cleanup
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [phrases, descriptions, hoveredFace]);

  // Tooltip/Card
  const tooltip = hoveredFace !== null && tooltipPos ? (
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-none"
      style={{
        left: tooltipPos.x + 24,
        top: tooltipPos.y - 12,
        minWidth: 220,
        maxWidth: 320,
        background: "rgba(24,24,27,0.92)",
        border: `1.5px solid ${FACE_COLORS[hoveredFace]}`,
        borderRadius: 12,
        boxShadow: `0 0 24px 2px ${FACE_COLORS[hoveredFace]}55, 0 2px 16px #000`,
        color: "#aefeff",
        padding: "1em 1.2em",
        fontFamily: FONT_FAMILY,
        fontSize: 16,
        transition: "opacity 0.2s cubic-bezier(.4,0,.2,1)",
        opacity: hoveredFace !== null ? 1 : 0,
        pointerEvents: "none",
        animation: "tooltip-fade-in 0.25s cubic-bezier(.4,0,.2,1)"
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{phrases[hoveredFace]}</div>
      <div style={{ fontWeight: 400, color: "#e0e0e0" }}>{descriptions[hoveredFace]}</div>
    </div>
  ) : null;

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[400px] md:h-[520px] flex items-center justify-center rounded-2xl overflow-hidden bg-[#18181b]"
      style={{ boxShadow: "0 0 64px 0 #00fff733, 0 0 0 1.5px #00fff722 inset" }}
    >
      {/* Tooltip overlay */}
      {tooltip}
      <style>{`
        @keyframes tooltip-fade-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default InteractiveCube; 