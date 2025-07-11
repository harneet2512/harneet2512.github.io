import { Heart, Coffee, Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6">
          {/* Main content */}
          <div className="space-y-4">
            <div className="font-mono font-bold text-2xl">
              <span className="text-white">Alex</span>
              <span className="text-coral">.</span>
              <span className="text-mint">Cook</span>
            </div>
            <p className="text-grey-300 max-w-md mx-auto">
              Building products that matter, leading teams that thrive, 
              creating outcomes that inspire.
            </p>
          </div>

          {/* Fun attribution */}
          <div className="flex items-center justify-center space-x-2 text-grey-400 text-sm">
            <span>Crafted with</span>
            <Heart className="h-4 w-4 text-coral animate-pulse" />
            <span>and plenty of</span>
            <Coffee className="h-4 w-4 text-mint" />
            <span>•</span>
            <Code className="h-4 w-4 text-grey-400" />
            <span>Built with React + Love</span>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-navy-light">
            <p className="text-grey-400 text-sm font-mono">
              © 2024 Alex Cook. Ready to build something amazing together.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}