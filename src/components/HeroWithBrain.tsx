import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { ComicStyleBrain } from "./ComicStyleBrain";

export function HeroWithBrain() {
  return (
    <section className="min-h-[55vh] max-h-[60vh] flex flex-col md:flex-row relative overflow-hidden bg-black pt-32 md:pt-40">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Left Side - Identity Text (60%) */}
      <div className="w-full md:w-[60%] flex items-center px-8 md:px-20 py-8 md:py-16 relative z-10">
        <div className="space-y-8 md:space-y-12 max-w-2xl">
          {/* Main greeting with generous spacing */}
          <div className="space-y-4 md:space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono text-white leading-none tracking-tight font-light">
              hello.
            </h1>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-mono text-white leading-none tracking-tight font-light">
              i'm harneet bali.
            </h2>
          </div>
          
          {/* Description with refined typography */}
          <p className="text-lg md:text-xl lg:text-2xl font-mono text-gray-300 leading-relaxed max-w-lg font-light">
            I shape intelligent systems with quiet precision.
          </p>
          
          {/* Subtle CTA in corner */}
          <div className="pt-8">
            <button className="group flex items-center space-x-3 text-white/60 font-mono text-lg font-light hover:text-white/80 transition-all duration-500">
              <span>→ let's talk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Comic Style Brain (40%) */}
      <div className="w-full md:w-[40%] relative bg-black flex justify-center items-center py-8 md:py-0 overflow-hidden">
        <ComicStyleBrain />
      </div>
    </section>
  );
} 