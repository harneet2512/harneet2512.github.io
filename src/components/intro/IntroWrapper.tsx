import React, { useState } from 'react';
import { AnimatedIntro } from './AnimatedIntro';
import { Navigation } from "@/components/Navigation";
import NotionHero from "@/components/NotionHero";
import { AboutMe } from "@/components/AboutMe";
import { Timeline } from "@/components/Timeline";
import { ProjectsImpact } from "@/components/ProjectsImpact";
import { PMToolkit } from "@/components/PMToolkit";
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
      
      <div className="min-h-screen opacity-100">
        <Navigation />
        
        <main>
          <section id="hero">
            <NotionHero />
          </section>
          
          <section id="about">
            <AboutMe />
          </section>
          
          <section id="timeline">
            <Timeline />
          </section>
          
          <section id="projects">
            <ProjectsImpact />
          </section>
          
          <section id="toolkit">
            <PMToolkit />
          </section>
          

          
          <section id="side-quests">
            <SideQuests />
          </section>
          
          <section id="connect">
            <Connect />
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
} 