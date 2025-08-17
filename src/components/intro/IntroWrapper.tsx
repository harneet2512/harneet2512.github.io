import { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import NotionHero from "@/components/NotionHero";
import { AboutMe } from "@/components/AboutMe";
import { Timeline } from "@/components/Timeline";
import { ProjectsImpact } from "@/components/ProjectsImpact";
import PMToolkit from "@/components/PMToolkit";
import { SideQuests } from "@/components/SideQuests";
import { Connect } from "@/components/Connect";
import { Footer } from "@/components/Footer";

// Full screen overlay state
interface FullScreenView {
  isOpen: boolean;
  type: 'architecture' | 'caseStudy' | 'demo';
  title: string;
}

export function IntroWrapper() {
  // Full screen overlay state
  const [fullScreenView, setFullScreenView] = useState<FullScreenView>({
    isOpen: false,
    type: 'architecture',
    title: ''
  });

  const handleFullScreenView = (type: 'architecture' | 'caseStudy' | 'demo', title: string) => {
    setFullScreenView({
      isOpen: true,
      type,
      title
    });
  };

  const closeFullScreenView = () => {
    setFullScreenView({
      isOpen: false,
      type: 'architecture',
      title: ''
    });
  };

  return (
    <>
      <div className="w-full min-h-screen">
        <Navigation />
        
        <main className="w-full">
          <section id="hero" className="w-full h-screen flex items-center justify-center relative">
            <NotionHero onFullScreenView={handleFullScreenView} />
          </section>
          
          <section id="about" className="w-full">
            <AboutMe />
          </section>
          
          <section id="timeline" className="w-full">
            <Timeline />
          </section>
          
          <section id="projects" className="w-full">
            <ProjectsImpact />
          </section>
          
          <section id="toolkit" className="w-full">
            <PMToolkit />
          </section>
          
          <section id="side-quests" className="w-full">
            <SideQuests />
          </section>
          
          <section id="connect" className="w-full">
            <Connect />
          </section>
        </main>
        
        <Footer />
      </div>

      {/* Full Screen Overlay - Covers entire website */}
      {fullScreenView.isOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[999999] flex items-center justify-center p-2 sm:p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh'
          }}
          onClick={closeFullScreenView}
        >
          <div 
            className="bg-[#1a1a1a] border border-[#333] rounded-lg sm:rounded-xl shadow-2xl w-full h-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#333]">
              <h2 className="text-lg sm:text-2xl font-semibold text-white truncate">
                {fullScreenView.type === 'architecture' && 'Architecture'}
                {fullScreenView.type === 'caseStudy' && 'Case Study'}
                {fullScreenView.type === 'demo' && 'Demo'}
                <span className="hidden sm:inline">: {fullScreenView.title}</span>
              </h2>
              <button
                onClick={closeFullScreenView}
                className="text-gray-400 hover:text-white transition-colors text-xl sm:text-2xl w-8 h-8 flex items-center justify-center"
                aria-label="Close full screen view"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
              {fullScreenView.type === 'architecture' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 sm:p-8 text-center">
                    <div className="text-4xl sm:text-8xl mb-4">🏗️</div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-4">System Architecture</h3>
                    <p className="text-base sm:text-xl text-gray-300 mb-6">
                      Interactive architecture diagram showing the complete system flow
                    </p>
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 sm:p-6">
                      <div className="text-3xl sm:text-6xl mb-4">📊</div>
                      <p className="text-sm sm:text-lg text-gray-400">Architecture visualization coming soon...</p>
                    </div>
                  </div>
                </div>
              )}

              {fullScreenView.type === 'caseStudy' && (
                <div className="space-y-4 sm:space-y-8">
                  <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 sm:p-8">
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Detailed Case Study</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                      <div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Process</h4>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Comprehensive analysis of the development process, challenges faced, and solutions implemented.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Results</h4>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Detailed metrics, outcomes, and impact measurements from the project implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 sm:p-6">
                    <p className="text-center text-sm sm:text-base text-gray-400">Full case study content coming soon...</p>
                  </div>
                </div>
              )}

              {fullScreenView.type === 'demo' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 sm:p-8 text-center">
                    <div className="text-4xl sm:text-8xl mb-4">🎥</div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-4">Interactive Demo</h3>
                    <p className="text-base sm:text-xl text-gray-300 mb-6">
                      Live demonstration of the feature in action
                    </p>
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 sm:p-6 aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl sm:text-6xl mb-4">▶️</div>
                        <p className="text-sm sm:text-lg text-gray-400">Demo video coming soon...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 