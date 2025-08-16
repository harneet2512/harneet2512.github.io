import React, { useState } from 'react';
import { AnimatedIntro } from './AnimatedIntro';
import { Navigation } from "@/components/Navigation";
import NotionHero from "@/components/NotionHero";
import { AboutMe } from "@/components/AboutMe";
import { Timeline } from "@/components/Timeline";
import { ProjectsImpact } from "@/components/ProjectsImpact";
import PMToolkit from "@/components/PMToolkit";
import { SideQuests } from "@/components/SideQuests";
import { Connect } from "@/components/Connect";
import { Footer } from "@/components/Footer";

export function IntroWrapper() {
  // Skip the AnimatedIntro and go directly to the main content
  const [showIntro, setShowIntro] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      {/* Removed AnimatedIntro to only show HARNEET preloader */}
      
      <div className="w-full min-h-screen">
        <Navigation />
        
        <main className="w-full">
          <section id="hero" className="w-full h-screen flex items-center justify-center relative">
            <NotionHero />
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
    </>
  );
} 