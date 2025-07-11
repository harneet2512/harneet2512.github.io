import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ExternalLink } from "lucide-react";

const navigationItems = [
  { name: "Hello", href: "#hero" },
  { name: "Journey", href: "#systems-map" },
  { name: "Projects", href: "#projects" },
  { name: "Toolkit", href: "#toolkit" },
  { name: "Side Quests", href: "#side-quests" },
  { name: "Connect", href: "#connect" }
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navigationItems.map(item => item.href.substring(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-grey-200" 
          : "bg-transparent"
      }`}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="font-mono font-bold text-xl">
              <span className="text-navy">Alex</span>
              <span className="text-coral">.</span>
              <span className="text-mint">Cook</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-sm font-medium transition-smooth hover:text-coral ${
                    activeSection === item.href.substring(1)
                      ? "text-coral"
                      : isScrolled 
                        ? "text-navy" 
                        : "text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button 
                size="sm"
                className="bg-mint text-navy hover:bg-mint-light transition-smooth font-mono"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Resume
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? "text-navy" : "text-white"}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? "text-navy" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-navy/95 backdrop-blur-md" />
          <div className="fixed top-16 left-0 right-0 bg-white border-t border-grey-200 shadow-lg">
            <div className="px-6 py-8 space-y-6">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left text-lg font-medium transition-smooth hover:text-coral ${
                    activeSection === item.href.substring(1)
                      ? "text-coral"
                      : "text-navy"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 border-t border-grey-200">
                <Button 
                  size="sm"
                  className="w-full bg-mint text-navy hover:bg-mint-light transition-smooth font-mono"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}