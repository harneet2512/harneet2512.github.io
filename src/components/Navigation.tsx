import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  isExternal?: boolean;
}

const navigationItems: NavigationItem[] = [
  { name: "Hello", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Journey", href: "#timeline" },
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

      const sections = navigationItems.map(i => i.href.slice(1));
      let current = sections[0];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 110 && rect.bottom >= 110) { current = s; break; }
      }
      setActiveSection(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string, isExternal = false) => {
    if (isExternal) { window.location.href = href; return; }
    const el = document.getElementById(href.substring(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md shadow-lg border-b border-gray-800/50"
            : "bg-transparent"
        }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          width: '100vw',
          height: 'auto'
        }}
      >
        {/* full-bleed row; remove `container` so brand hits true left */}
        <div className="w-full px-fluid">
          <div className="flex h-20 items-center space-fluid-x">
            {/* Brand — pinned hard left */}
            <button
              onClick={() => scrollToSection("#hero")}
              className="font-mono font-bold text-fluid-xl text-left text-white hover:text-white/90"
              aria-label="Go to top"
            >
              <span>Harneet</span>
              <span className="text-blue-400">.</span>
              <span className="text-gray-300">Bali</span>
            </button>

            {/* Links — push to the far right */}
            <div className="hidden lg:flex items-center ml-auto">
              <div className="flex items-center space-fluid-x bg-black/20 backdrop-blur-sm rounded-full px-fluid py-2 border border-gray-800/50">
                {navigationItems.map((item) => {
                  const isActive = !item.isExternal && activeSection === item.href.slice(1);
                  return (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href, item.isExternal)}
                      className={`px-fluid py-2 rounded-full text-fluid-sm font-mono font-medium transition-all duration-300 hover:bg-white/10 ${
                        isActive
                          ? "text-white bg-white/20 shadow-lg"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu toggle — stays on far right */}
            <button
              className="lg:hidden ml-auto p-2"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[9998] lg:hidden"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md" />
          <div 
            className="fixed top-20 left-0 right-0 bg-black/90 border-t border-gray-800/50 shadow-lg"
            style={{
              position: 'fixed',
              top: '5rem',
              left: 0,
              right: 0,
              width: '100vw'
            }}
          >
            <div className="px-fluid py-fluid space-fluid-y">
              {navigationItems.map((item) => {
                const isActive = !item.isExternal && activeSection === item.href.slice(1);
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href, item.isExternal)}
                    className={`block w-full text-left text-fluid-lg font-mono font-medium transition-all duration-300 py-3 px-fluid rounded-lg hover:bg-white/5 ${
                      isActive ? "text-blue-400 bg-white/10" : "text-gray-300 hover:text-blue-400"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
