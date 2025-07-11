import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Gamepad2, Coffee, Lightbulb, Github, Pen } from "lucide-react";

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
    color: "mint",
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
    color: "coral",
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
    color: "navy",
    tags: ["Career Growth", "Mentoring", "Community"]
  },
  {
    id: 4,
    title: "Design System Documentation",
    subtitle: "Open-sourcing learnings from building scalable systems",
    description: "Documenting best practices and common pitfalls when building design systems at scale. Includes component libraries, design tokens, and governance frameworks.",
    icon: Github,
    type: "Open Source",
    status: "In Progress",
    link: "#",
    stats: "2.3k stars • 45 contributors",
    color: "mint",
    tags: ["Design Systems", "Documentation", "React"]
  },
  {
    id: 5,
    title: "Product Strategy Workshop",
    subtitle: "Teaching strategic thinking to non-PMs",
    description: "A workshop I developed for engineers, designers, and marketers to think more strategically about product decisions. Covers frameworks, prioritization, and user-centered thinking.",
    icon: Lightbulb,
    type: "Teaching",
    status: "Scheduled",
    link: "#",
    stats: "8 workshops • 200+ participants",
    color: "coral",
    tags: ["Education", "Strategy", "Cross-functional"]
  },
  {
    id: 6,
    title: "Product Management Zine",
    subtitle: "A quarterly publication for product nerds",
    description: "I co-create a small print zine that covers product management through different lenses - philosophy, psychology, technology, and culture. It's delightfully analog in a digital world.",
    icon: Pen,
    type: "Creative",
    status: "Issue #4",
    link: "#",
    stats: "500 subscribers • Quarterly",
    color: "navy",
    tags: ["Publishing", "Community", "Creative Writing"]
  }
];

export function SideQuests() {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'mint':
        return {
          bg: 'bg-mint/10',
          border: 'border-mint/30',
          icon: 'bg-mint text-navy',
          accent: 'text-mint',
          button: 'bg-mint text-navy hover:bg-mint-light'
        };
      case 'coral':
        return {
          bg: 'bg-coral/10',
          border: 'border-coral/30',
          icon: 'bg-coral text-white',
          accent: 'text-coral',
          button: 'bg-coral text-white hover:bg-coral-light'
        };
      case 'navy':
        return {
          bg: 'bg-navy/10',
          border: 'border-navy/30',
          icon: 'bg-navy text-white',
          accent: 'text-navy',
          button: 'bg-navy text-white hover:bg-navy-light'
        };
      default:
        return {
          bg: 'bg-grey-100',
          border: 'border-grey-300',
          icon: 'bg-grey-500 text-white',
          accent: 'text-grey-600',
          button: 'bg-grey-500 text-white hover:bg-grey-600'
        };
    }
  };

  return (
    <section id="side-quests" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <Badge className="mb-4 bg-coral/10 text-coral border-coral/20 font-mono">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Experiments
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6 font-mono">
            Side{" "}
            <span className="text-gradient bg-gradient-to-r from-coral to-mint bg-clip-text text-transparent">
              Quests
            </span>
          </h2>
          <p className="text-xl text-grey-600 max-w-3xl mx-auto leading-relaxed">
            The fun experiments, creative projects, and community contributions that keep me 
            curious and connected to the broader product ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sideQuests.map((quest, index) => {
            const colors = getColorClasses(quest.color);
            
            return (
              <Card 
                key={quest.id}
                className="p-8 hover-lift transition-smooth group animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${colors.icon} shadow-md group-hover:shadow-lg transition-smooth`}>
                      <quest.icon className="h-6 w-6" />
                    </div>
                    <div className="text-right space-y-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${colors.bg} ${colors.border} ${colors.accent} font-mono`}
                      >
                        {quest.type}
                      </Badge>
                      <p className="text-xs text-grey-500">
                        {quest.status}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-mono font-semibold text-navy text-lg mb-2">
                        {quest.title}
                      </h3>
                      <p className="text-grey-600 text-sm font-medium mb-3">
                        {quest.subtitle}
                      </p>
                      <p className="text-grey-700 text-sm leading-relaxed">
                        {quest.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-grey-200">
                      <p className="text-xs text-grey-500 font-mono">
                        {quest.stats}
                      </p>
                      <div className={`w-2 h-2 rounded-full ${colors.icon.split(' ')[0]} animate-pulse`}></div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {quest.tags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-grey-100 text-grey-600 hover:bg-grey-200 transition-smooth"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`w-full ${colors.border} ${colors.accent} hover:${colors.bg} transition-smooth group-hover:shadow-md`}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Explore Project
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Fun facts section */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-navy mb-8 font-mono">
              When I'm not shipping products...
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-full flex items-center justify-center shadow-coral-glow">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
                <p className="text-grey-700">
                  I'm probably trying a new coffee shop and sketching product ideas on napkins
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-mint to-navy rounded-full flex items-center justify-center shadow-glow">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <p className="text-grey-700">
                  Reading everything from sci-fi novels to behavioral psychology papers
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-coral to-mint rounded-full flex items-center justify-center shadow-coral-glow">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <p className="text-grey-700">
                  Building random things with new technologies just to see what's possible
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <p className="text-grey-600 mb-6">
            Have an interesting side project or collaboration idea?
          </p>
          <button className="text-coral hover:text-coral-dark font-mono font-semibold transition-smooth hover:underline">
            Let's explore building something together →
          </button>
        </div>
      </div>
    </section>
  );
}