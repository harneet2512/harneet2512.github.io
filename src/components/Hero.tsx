import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-[60vh] md:min-h-[55vh] max-h-[70vh] md:max-h-[60vh] flex flex-col md:flex-row relative overflow-hidden bg-black pt-20 md:pt-32 lg:pt-40">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full flex items-center px-6 md:px-8 lg:px-20 py-8 md:py-16 relative z-10">
        <div className="space-y-6 md:space-y-8 lg:space-y-12 max-w-2xl">
          {/* Main greeting with generous spacing */}
          <div className="space-y-3 md:space-y-4 lg:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-mono text-white leading-none tracking-tight font-light">
              hello.
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-mono text-white leading-none tracking-tight font-light">
              i'm alex cook.
            </h2>
          </div>
          
          {/* Description with refined typography */}
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-mono text-gray-300 leading-relaxed max-w-lg font-light">
            I shape intelligent systems with quiet precision.
          </p>
          
          {/* Subtle CTA in corner */}
          <div className="pt-4 md:pt-8">
            <button className="group flex items-center space-x-3 text-white/60 font-mono text-base md:text-lg font-light hover:text-white/80 transition-all duration-500">
              <span>→ let's talk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}