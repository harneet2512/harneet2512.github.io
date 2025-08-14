import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Gamepad2, Coffee, Lightbulb, Github, Pen } from "lucide-react";
import { useState } from "react";

const sideQuests = [
  {
    id: 1,
    title: "Product Teardown Blog",
    subtitle: "Weekly deep-dives into product decisions",
    description: "I reverse-engineer products I love (and sometimes hate) to understand the strategic decisions behind user experiences. From Notion's block architecture to Spotify's recommendation engine.",
    icon: BookOpen,
    type: "Writing",
    status: "Active",
    link: "#",
    stats: "25 articles • 10k+ reads",
    color: "blue",
    tags: ["Product Analysis", "UX Strategy", "Growth"]
  },
  {
    id: 2,
    title: "Weekend Hackathon Projects",
    subtitle: "Building tiny tools that solve real problems",
    description: "Quick experiments with new technologies and product ideas. Recent builds include a Chrome extension for product research and a simple tool that helps PMs track feature adoption.",
    icon: Gamepad2,
    type: "Building",
    status: "Ongoing", 
    link: "#",
    stats: "12 projects • 3 shipped",
    color: "purple",
    tags: ["Prototyping", "JavaScript", "Chrome Extension"]
  },
  {
    id: 3,
    title: "PM Coffee Chats",
    subtitle: "Mentoring the next generation of product people",
    description: "Monthly coffee chats with aspiring PMs, career switchers, and fellow product folks. Sharing lessons learned, reviewing portfolios, and discussing the ever-evolving PM landscape.",
    icon: Coffee,
    type: "Mentoring",
    status: "Open",
    link: "#",
    stats: "50+ sessions • 4.9/5 rating",
    color: "green",
    tags: ["Career Growth", "Mentoring", "Community"]
  }
];

export function SideQuests() {
  const [selectedQuest, setSelectedQuest] = useState<number | null>(null);
  const [hoveredQuest, setHoveredQuest] = useState<number | null>(null);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: 'bg-blue-500 text-white',
          accent: 'text-blue-300',
          button: 'bg-blue-500 text-white hover:bg-blue-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          icon: 'bg-purple-500 text-white',
          accent: 'text-purple-300',
          button: 'bg-purple-500 text-white hover:bg-purple-600'
        };
      case 'green':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: 'bg-green-500 text-white',
          accent: 'text-green-300',
          button: 'bg-green-500 text-white hover:bg-green-600'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/30',
          icon: 'bg-gray-500 text-white',
          accent: 'text-gray-300',
          button: 'bg-gray-500 text-white hover:bg-gray-600'
        };
    }
  };

  return (
    <section id="side-quests" className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
            <Lightbulb className="w-4 h-4 mr-2" />
            Side Quests
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-mono">
            Beyond the{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Day Job
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Personal projects, experiments, and community initiatives that keep me sharp and connected to the broader product ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sideQuests.map((quest) => {
            const colors = getColorClasses(quest.color);
            const IconComponent = quest.icon;
            const isSelected = selectedQuest === quest.id;
            const isHovered = hoveredQuest === quest.id;
            
            return (
              <Card
                key={quest.id}
                className={`group relative overflow-hidden border transition-all duration-200 ease-in-out cursor-pointer ${
                  isSelected 
                    ? `${colors.border} bg-gray-800/50 shadow-2xl scale-105` 
                    : isHovered 
                      ? 'border-gray-600/50 bg-gray-900/50 shadow-xl scale-[0.97] translate-y-[2px]' 
                      : 'border-gray-800/50 bg-gray-900/30 hover:border-gray-600/50 hover:shadow-2xl'
                }`}
                onClick={() => setSelectedQuest(isSelected ? null : quest.id)}
                onMouseEnter={() => setHoveredQuest(quest.id)}
                onMouseLeave={() => setHoveredQuest(null)}
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isSelected ? `${colors.icon} scale-110 shadow-lg` : colors.icon
                    }`}>
                      <IconComponent className={`w-6 h-6 transition-transform duration-300 ${
                        isSelected ? 'scale-110' : ''
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-mono ${colors.border} ${colors.accent}`}
                        >
                          {quest.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="text-xs border-gray-600 text-gray-400 font-mono"
                        >
                          {quest.status}
                        </Badge>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        {quest.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {quest.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 font-mono">
                      {quest.stats}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {quest.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-300 font-mono"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-800/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 ${
                        isSelected 
                          ? `bg-blue-500 text-white border-blue-500` 
                          : ``
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle button click - could open modal, navigate, etc.
                        console.log(`Clicked on ${quest.title}`);
                      }}
                    >
                      <span className="text-xs">
                        {isSelected ? 'View Details' : 'Learn More'}
                      </span>
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>


      </div>
    </section>
  );
}