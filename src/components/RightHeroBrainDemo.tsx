import RightHeroBrain from "./RightHeroBrain";

export function RightHeroBrainDemo() {
  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-8 text-white font-mono">
        <h1 className="text-2xl font-bold mb-2">RightHeroBrain Demo</h1>
        <p className="text-gray-400">Spider-Verse Brain Visualization Component</p>
      </div>

      {/* Component */}
      <div className="flex-1 w-full">
        <RightHeroBrain 
          autoPlay={true}
          scale={1.2}
          animationDelay={0}
        />
      </div>
    </div>
  );
} 