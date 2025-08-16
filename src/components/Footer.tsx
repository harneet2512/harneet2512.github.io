import { Heart, Coffee, Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-gray-900/50 py-8 md:py-12">
      <div className="container mx-auto w-full px-4 md:px-6 lg:px-8" style={{ maxWidth: "min(92vw, 1760px)" }}>
        <div className="text-center space-y-4 md:space-y-6">
          {/* Main content */}
          <div className="space-y-3 md:space-y-4">
            <div className="font-mono font-bold text-xl md:text-2xl">
              <span className="text-white">Harneet</span>
              <span className="text-blue-400">.</span>
              <span className="text-purple-400">Bali</span>
            </div>
            <p className="text-sm md:text-base text-gray-300 max-w-md mx-auto px-4">
              Building products that matter, leading teams that thrive, 
              creating outcomes that inspire.
            </p>
          </div>



          {/* Copyright */}
          <div className="pt-4 md:py-6 border-t border-gray-900/50">
            <p className="text-gray-400 text-xs md:text-sm font-mono">
              © 2025 Harneet Bali. Ready to build something amazing together.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}