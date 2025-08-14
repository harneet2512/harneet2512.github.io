import { Heart, Coffee, Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-8 md:py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
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
          <div className="pt-4 md:pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-xs md:text-sm font-mono">
              © 2025 Harneet Bali. Ready to build something amazing together.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}