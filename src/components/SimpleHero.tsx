import React from 'react';

const SimpleHero: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 font-mono">
          HARNEET
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-mono">
          Product Manager & AI Enthusiast
        </p>
        <div className="space-y-4">
          <p className="text-lg text-gray-400 font-mono">
            Problem Solver • Systems Thinker • Product Architect
          </p>
          <p className="text-lg text-gray-400 font-mono">
            Team Catalyst • Future Shaper
          </p>
        </div>
        <div className="mt-12">
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto">
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHero;
