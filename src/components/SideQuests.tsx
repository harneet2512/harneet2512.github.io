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
    description: "I'm passionate about understanding what makes great products tick. From analyzing user experience flows to dissecting growth strategies, I love exploring the strategic decisions that shape the products we use every day.",
    icon: BookOpen,
    type: "Writing",
    status: "Coming Soon",
    link: "#",
    stats: "",
    color: "blue",
    tags: ["Product Analysis", "UX Strategy", "Growth"]
  },
  {
    id: 2,
    title: "Chess Enthusiast",
    subtitle: "Love playing chess and connecting with fellow players",
    description: "I'm passionate about chess and love playing games with fellow enthusiasts. Connect with me on Chess.com and let's play a game! I'm always up for friendly matches and learning from other players.",
    icon: Gamepad2,
    type: "Gaming",
    status: "Active", 
    link: "https://www.chess.com/member/hsb_2512",
    stats: "Active player • Always open for games",
    color: "purple",
    tags: ["Chess", "Strategy", "Community", "Gaming"]
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

      <div className="container mx-auto w-full px-4 md:px-6 lg:px-8 relative z-10" style={{ maxWidth: "min(92vw, 1760px)" }}>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-mono text-white font-light tracking-tight mb-4 md:mb-6">
            Side Quests
          </h2>
          <p className="text-lg md:text-xl font-mono text-gray-400 font-light px-4">
            Personal projects and explorations beyond the day job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
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
                          className={`text-xs font-mono ${
                            quest.status === 'Coming Soon'
                              ? 'border-yellow-400 text-yellow-300'
                              : quest.status === 'Active' || quest.status === 'Open'
                              ? 'border-green-400 text-green-300'
                              : 'border-blue-400 text-blue-300'
                          }`}
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
                  {quest.stats && (
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 font-mono">
                        {quest.stats}
                      </p>
                    </div>
                  )}

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
                      className={`w-full transition-all duration-300 ${
                        quest.status === 'Coming Soon'
                          ? 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'
                          : isSelected 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (quest.status !== 'Coming Soon') {
                          if (quest.link && quest.link !== '#') {
                            window.open(quest.link, '_blank');
                          } else {
                            // Handle button click - could open modal, navigate, etc.
                            console.log(`Clicked on ${quest.title}`);
                          }
                        }
                      }}
                      disabled={quest.status === 'Coming Soon'}
                    >
                      <span className="text-xs">
                        {quest.status === 'Coming Soon' 
                          ? 'Coming Soon' 
                          : quest.title === 'Chess Enthusiast'
                          ? 'Play Chess'
                          : isSelected 
                            ? 'View Details' 
                            : 'Learn More'
                        }
                      </span>
                      {quest.status !== 'Coming Soon' && <ExternalLink className="w-3 h-3 ml-2" />}
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