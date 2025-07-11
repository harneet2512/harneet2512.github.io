import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import alexAvatar from "@/assets/alex-avatar.jpg";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden gradient-hero">
      {/* Floating elements for whimsy */}
      <div className="absolute top-20 left-20 w-20 h-20 rounded-full bg-mint/20 animate-float"></div>
      <div className="absolute top-40 right-32 w-16 h-16 rounded-full bg-coral/20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-16 w-12 h-12 rounded-full bg-mint/30 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <p className="text-mint font-mono text-sm tracking-wide uppercase">
                Hello There 👋
              </p>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                I'm{" "}
                <span className="text-gradient bg-gradient-to-r from-mint to-coral bg-clip-text text-transparent">
                  Alex Cook
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-grey-200 font-light leading-relaxed">
                Product Manager who builds products that people love,
                <br />
                <span className="text-mint">
                  teams that thrive, and outcomes that matter.
                </span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-mint text-navy hover:bg-mint-light transition-smooth hover-lift font-mono"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Explore My Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-mint text-mint hover:bg-mint/10 transition-smooth hover-lift"
              >
                Let's Connect
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-grey-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-mint animate-pulse"></div>
                <span className="text-sm">Available for new opportunities</span>
              </div>
            </div>
          </div>
          
          {/* Avatar/Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <img 
                src={alexAvatar} 
                alt="Alex Cook"
                className="w-full max-w-md mx-auto rounded-3xl shadow-xl hover-lift transition-smooth"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-mint/20 to-coral/20 rounded-3xl blur-xl"></div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-mint" />
        </div>
      </div>
    </section>
  );
}