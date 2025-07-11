import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { SystemsMap } from "@/components/SystemsMap";
import { ProjectsImpact } from "@/components/ProjectsImpact";
import { PMToolkit } from "@/components/PMToolkit";
import { SideQuests } from "@/components/SideQuests";
import { Connect } from "@/components/Connect";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        <section id="hero">
          <Hero />
        </section>
        
        <SystemsMap />
        <ProjectsImpact />
        <PMToolkit />
        <SideQuests />
        <Connect />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
