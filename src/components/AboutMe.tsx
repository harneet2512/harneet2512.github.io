import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AboutMe() {
  const [activeTab, setActiveTab] = useState('story');
  const [visibleTiles, setVisibleTiles] = useState<Set<number>>(new Set());
  const [currentWinIndex, setCurrentWinIndex] = useState(0);
  
  const coreProductWins = [
    "Automated critical workflows to cut cycle time",
    "Designed new benchmarking features", 
    "Improved decision-making with real-time insights"
  ];

  const tabs = [
    { id: 'story', label: 'My Story' },
    { id: 'approach', label: 'How I Think & Work' },
    { id: 'impact', label: 'Business Impact' },
    { id: 'vision', label: 'Strategic Vision' }
  ];

  const tabContent = {
    story: {
      title: "My Story",
      content: "  I'm a Product Manager passionate about AI, designing systems that automate workflows, unlock insights, and scale meaningful impact. Before focusing on AI, I led product strategy, translating user needs into clear roadmaps and aligning cross-functional teams across engineering, design, and operations. My journey began as a developer, crafting clean, efficient code, and grew into a passion for creating products that work beautifully, delight users, and drive lasting, measurable value."
    },
    approach: {
      title: "How I Think & Work",
      content: "I approach product management with a balance of strategic vision and execution discipline. I start by deeply understanding user needs, market context, and business objectives, then translate them into clear, measurable roadmaps. Collaboration is at the core, aligning engineering, design, and stakeholders to move fast without losing quality. I rely on data to validate decisions, creativity to solve problems, and a relentless focus on delivering products that create meaningful impact."
    },
    impact: {
      title: "Business Impact",
      content: "Business impact comes from aligning product vision with meaningful change. At ConnectiveRx, AI-driven automation reshaped quality assurance and streamlined operations. AdSkate benefited from features that elevated advertiser performance, improved engagement, and strengthened competitive edge in the market landscape. Across these experiences, the focus remained on solutions that deliver efficiency, drive adoption, and create lasting value for both users and the business."
    },
    vision: {
      title: "Strategic Vision",
      content: "Strategy and vision emerge from connecting technology, user needs, and market opportunities into a clear, actionable path forward. It begins with deep research to uncover pain points and trends, then shaping a roadmap that balances short-term wins with long-term goals. Strong execution is paired with adaptability, ensuring products evolve with changing conditions and emerging opportunities. Every decision is anchored in creating sustainable value, anticipating change, and guiding teams toward impactful outcomes."
    }
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const tileIndex = parseInt(entry.target.getAttribute('data-tile-index') || '0');
          if (entry.isIntersecting) {
            setVisibleTiles(prev => new Set([...prev, tileIndex]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const tiles = document.querySelectorAll('[data-tile-index]');
    tiles.forEach(tile => observer.observe(tile));

    return () => observer.disconnect();
  }, []);

  // Rotate through core product wins every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinIndex((prev) => (prev + 1) % coreProductWins.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [coreProductWins.length]);

  return (
    <section className="min-h-screen bg-black py-12 md:py-20 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
  
      <div className="container mx-auto w-full px-4 md:px-6 lg:px-8 relative z-10" style={{ maxWidth: "min(92vw, 1760px)" }}>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-mono text-white font-light tracking-tight mb-4">
            About Me.
          </h2>
          <p className="text-lg md:text-xl font-mono text-gray-400 font-light px-4">
            From Code to Strategy: Building products that anticipate and shape the future
          </p>
        </div>
  
        {/* Grid Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-2 max-w-6xl mx-auto items-start">
          {/* Left + Center + Projects Shipped (grouped as col-span-8 on large screens) */}
          <div className="lg:col-span-8 flex flex-col space-y-4 md:space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2">
              {/* Left Column */}
              <div className="space-y-4 md:space-y-2">
                {/* Tools & Methods */}
                <div data-tile-index="1" className={`bg-[#111] rounded-xl p-4 md:p-6 border border-gray-800/50 hover:border-blue-500/30 transition-all duration-200 ease-in-out ${
                  visibleTiles.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } hover:scale-[0.97] hover:translate-y-[2px] hover:shadow-2xl cursor-pointer group`}>
                  <h3 className="text-base md:text-lg font-mono text-white font-medium mb-3 md:mb-4">Tools & Methods</h3>
                  <ul className="text-xs md:text-sm font-mono text-gray-300 space-y-1 md:space-y-2">
                    <li className="group-hover:text-blue-300 transition-colors duration-300">• Figma, Miro, Amplitude</li>
                    <li className="group-hover:text-blue-300 transition-colors duration-300 delay-100">• SQL, Python, A/B Testing</li>
                    <li className="group-hover:text-blue-300 transition-colors duration-300 delay-200">• Design Thinking, Lean UX</li>
                    <li className="group-hover:text-blue-300 transition-colors duration-300 delay-300">• Cross-functional Leadership</li>
                    <li className="group-hover:text-blue-300 transition-colors duration-300 delay-400">• User Research, Analytics</li>
                    <li className="group-hover:text-blue-300 transition-colors duration-300 delay-500">• Product Roadmapping, OKRs</li>
                  </ul>
                </div>
  
                {/* Years of Experience */}
                <div data-tile-index="2" className={`bg-[#111] rounded-xl p-4 md:p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-200 ease-in-out ${
                  visibleTiles.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } hover:scale-[0.97] hover:translate-y-[2px] hover:shadow-2xl cursor-pointer text-center`}>
                  <div className="text-2xl md:text-3xl font-mono text-white font-bold mb-2">2+</div>
                  <div className="text-xs md:text-sm font-mono text-gray-400">Years of Experience</div>
                </div>
  
                {/* Core Product Wins */}
                <div data-tile-index="3" className={`bg-[#111] rounded-xl p-4 md:p-6 border border-gray-800/50 hover:border-green-500/30 transition-all duration-200 ease-in-out ${
                  visibleTiles.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } hover:scale-[0.97] hover:translate-y-[2px] hover:shadow-2xl cursor-pointer text-center`}>
                  <div className="text-xs md:text-sm font-mono text-gray-400 mb-2">Core Product Wins</div>
                  <div className="text-sm md:text-base font-mono text-white font-medium min-h-[60px] md:min-h-[80px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentWinIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="text-center leading-tight"
                      >
                        {coreProductWins[currentWinIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
  
              {/* Center Column */}
              <div className="flex flex-col items-center space-y-4 md:space-y-2">
                {/* Profile Image */}
                <div data-tile-index="4" className={`w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-gray-800/50 hover:border-blue-500/50 transition-all duration-500 overflow-hidden ${
                  visibleTiles.has(4) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                } hover:scale-105 cursor-pointer group`}>
                  <img 
                    src="/Linkedin__.jpeg" 
                    alt="Harneet Bali Profile" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
  
                <h3 className="text-xl md:text-2xl lg:text-3xl font-mono text-white font-medium mb-2">Harneet Bali</h3>
  
                {/* Focus Areas */}
                <div data-tile-index="5" className={`w-full bg-[#111] rounded-xl p-4 md:p-6 border border-gray-800/50 hover:border-orange-500/30 transition-all duration-200 ease-in-out ${
                  visibleTiles.has(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } hover:scale-[0.97] hover:translate-y-[2px] hover:shadow-2xl cursor-pointer group`}>
                  <h3 className="text-base md:text-lg font-mono text-white font-medium mb-3 md:mb-4">Focus Areas</h3>
                  <ul className="text-xs md:text-sm font-mono text-gray-300 space-y-1 md:space-y-2">
                    <li className="group-hover:text-orange-300 transition-colors duration-300">• B2B SaaS Product Strategy</li>
                    <li className="group-hover:text-orange-300 transition-colors duration-300 delay-100">• AI/ML Product Development</li>
                    <li className="group-hover:text-orange-300 transition-colors duration-300 delay-200">• User Experience Design</li>
                    <li className="group-hover:text-orange-300 transition-colors duration-300 delay-300">• A/B Testing & User Research</li>
                    <li className="group-hover:text-orange-300 transition-colors duration-300 delay-400">• Leading Cross-Functional Teams</li>
                    <li className="group-hover:text-orange-300 transition-colors duration-300 delay-700">• Product Roadmapping & Execution</li>
                    
                  </ul>
                </div>
              </div>
            </div>
  
            {/* Projects Shipped */}
            <div data-tile-index="7" className={`bg-[#111] rounded-xl p-6 md:p-8 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-200 ease-in-out ${
              visibleTiles.has(7) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } hover:scale-[0.97] hover:translate-y-[2px] hover:shadow-2xl cursor-pointer text-center group`}>
              <div className="text-3xl md:text-4xl lg:text-5xl font-mono text-white font-bold mb-4 group-hover:text-purple-300 transition-colors duration-300">5+</div>
              <div className="text-lg md:text-xl font-mono text-gray-400 mb-4 md:mb-6">Projects Shipped</div>
              <p className="text-sm md:text-lg font-mono text-gray-300 leading-relaxed max-w-2xl mx-auto px-4">
                From enterprise SaaS platforms to AI-powered tools, each project represents a step toward building products that feel like intuition.
              </p>
            </div>
          </div>
  
          {/* Right Column - Tabs + Content */}
          <div className="lg:col-span-4 space-y-4 md:space-y-2 lg:col-start-9">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-mono text-xs md:text-sm font-medium transition-all duration-300 border border-gray-800/50 ${
                    activeTab === tab.id
                      ? 'bg-[#111] text-white border-blue-500/50 shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900 hover:border-gray-600/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
  
            {/* Tab Content */}
            <div data-tile-index="6" className={`bg-[#111] rounded-xl p-6 md:p-8 border border-gray-800/50 hover:border-blue-500/30 transition-all duration-200 ease-in-out h-[720px] ${
              visibleTiles.has(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } hover:scale-[0.97] hover:translate-y-[2px] hover:shadow-2xl`}>
              <div className="h-full flex flex-col">
                <h4 className="text-xl md:text-2xl font-mono text-white font-medium mb-4 md:mb-6">
                  {tabContent[activeTab as keyof typeof tabContent].title}
                </h4>
                <div className="flex-1">
                  <p className="text-sm md:text-lg font-mono text-gray-300 leading-relaxed">
                    {tabContent[activeTab as keyof typeof tabContent].content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  

      </div>
    </section>
  );
}  