import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Zap, Users, TrendingUp, Target, Brain } from "lucide-react";
import systemsMapImage from "@/assets/systems-map.jpg";

const journeyNodes = [
  {
    id: 1,
    title: "Product Strategy",
    icon: Target,
    description: "Vision & roadmap alignment",
    position: "top-left",
    skills: ["Market Research", "Competitive Analysis", "OKRs"],
    impact: "3x user growth"
  },
  {
    id: 2,
    title: "User Research",
    icon: Users,
    description: "Human-centered insights",
    position: "top-right",
    skills: ["User Interviews", "A/B Testing", "Analytics"],
    impact: "40% improved UX"
  },
  {
    id: 3,
    title: "Data-Driven Decisions",
    icon: TrendingUp,
    description: "Metrics that matter",
    position: "center",
    skills: ["SQL", "Mixpanel", "Looker"],
    impact: "2x conversion rate"
  },
  {
    id: 4,
    title: "Cross-functional Leadership",
    icon: Brain,
    description: "Building high-performing teams",
    position: "bottom-left",
    skills: ["Agile", "Stakeholder Management", "Communication"],
    impact: "95% team satisfaction"
  },
  {
    id: 5,
    title: "Innovation & Growth",
    icon: Zap,
    description: "From 0 to 1 product launches",
    position: "bottom-right",
    skills: ["MVP Development", "Go-to-Market", "Growth Hacking"],
    impact: "$2M ARR generated"
  }
];

export function SystemsMap() {
  return (
    <section id="systems-map" className="py-24 bg-black relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
            <MapPin className="w-4 h-4 mr-2" />
            Journey Map
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-mono">
            My Product{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Systems Map
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Not just a timeline, but a dynamic network of interconnected skills, experiences, 
            and impact that defines my approach to product management.
          </p>
        </div>

        <div className="relative">
          {/* Background illustration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <img 
              src={systemsMapImage} 
              alt="Systems network"
              className="max-w-4xl w-full"
            />
          </div>

          {/* Interactive nodes grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {journeyNodes.map((node, index) => (
              <Card 
                key={node.id}
                className="p-8 hover-lift transition-all duration-200 ease-in-out hover-glow cursor-pointer group animate-scale-in bg-[#111] border-gray-800/50 hover:border-blue-500/30 hover:scale-[0.97] hover:translate-y-[2px]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="space-y-6">
                  {/* Icon and title */}
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg group-hover:animate-pulse transition-smooth">
                      <node.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-white text-lg">
                        {node.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {node.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-mono">
                      Key Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {node.skills.map((skill) => (
                        <Badge 
                          key={skill}
                          variant="secondary"
                          className="text-xs bg-gray-800 text-gray-300 hover:bg-blue-500/10 hover:text-blue-300 transition-smooth"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-gray-400 font-mono">
                        Impact
                      </span>
                      <span className="text-blue-300 font-semibold">
                        {node.impact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connection lines (decorative) */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-400 opacity-20 group-hover:opacity-100 transition-smooth"></div>
              </Card>
            ))}
          </div>

          {/* Interactive connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            {/* Add subtle connecting lines between cards */}
            <path
              d="M 200,200 Q 400,100 600,200"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M 600,200 Q 500,300 400,400"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
          <p className="text-gray-300 mb-6">
            Want to see how these skills translate into real-world results?
          </p>
          <button className="text-blue-300 hover:text-blue-200 font-mono font-semibold transition-smooth hover:underline">
            Explore My Project Case Studies →
          </button>
        </div>
      </div>
    </section>
  );
}