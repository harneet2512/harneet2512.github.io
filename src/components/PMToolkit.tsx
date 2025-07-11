import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BarChart3, Brain, Users2, Target, Zap, Code, Database, MessageSquare, Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";

const toolkitItems = [
  {
    id: 1,
    category: "Data & Analytics",
    icon: BarChart3,
    title: "Data-Driven Decisions",
    description: "From SQL queries to actionable insights",
    tools: ["SQL", "Mixpanel", "Amplitude", "Looker", "Python"],
    scenario: "Discovered that 40% of users dropped off during onboarding by analyzing funnel data, leading to a complete redesign that improved retention by 25%.",
    color: "mint"
  },
  {
    id: 2,
    category: "AI & Automation", 
    icon: Brain,
    title: "AI-Powered Solutions",
    description: "Leveraging ML for product innovation",
    tools: ["TensorFlow", "OpenAI API", "Recommendation Systems", "NLP", "AutoML"],
    scenario: "Built a customer support chatbot that reduced ticket volume by 60% while maintaining 4.5/5 satisfaction scores.",
    color: "coral"
  },
  {
    id: 3,
    category: "User Research",
    icon: Users2,
    title: "Human-Centered Design",
    description: "Understanding users beyond demographics",
    tools: ["User Interviews", "Usability Testing", "Surveys", "Journey Mapping", "Personas"],
    scenario: "Conducted 50+ user interviews that revealed a critical gap in our assumptions, pivoting our roadmap and saving 6 months of development.",
    color: "navy"
  },
  {
    id: 4,
    category: "Strategy & Planning",
    icon: Target,
    title: "Strategic Thinking",
    description: "From vision to execution",
    tools: ["OKRs", "Roadmapping", "Competitive Analysis", "Market Research", "Business Cases"],
    scenario: "Developed a 3-year product strategy that aligned 4 cross-functional teams and resulted in 200% user growth.",
    color: "mint"
  },
  {
    id: 5,
    category: "Agile & Process",
    icon: Zap,
    title: "Agile Excellence", 
    description: "Building high-performing teams",
    tools: ["Scrum", "Kanban", "Jira", "Confluence", "Retrospectives"],
    scenario: "Transformed a struggling team's velocity by 150% through process optimization and better stakeholder communication.",
    color: "coral"
  },
  {
    id: 6,
    category: "Technical Collaboration",
    icon: Code,
    title: "Technical Partnership",
    description: "Bridge between business and engineering",
    tools: ["APIs", "Technical Specs", "System Design", "Git", "Figma"],
    scenario: "Worked with engineers to design a scalable architecture that reduced page load times by 70% while cutting infrastructure costs.",
    color: "navy"
  }
];

export function PMToolkit() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'mint':
        return {
          bg: 'bg-mint/10',
          border: 'border-mint/30',
          icon: 'bg-mint text-navy',
          accent: 'text-mint'
        };
      case 'coral':
        return {
          bg: 'bg-coral/10',
          border: 'border-coral/30', 
          icon: 'bg-coral text-white',
          accent: 'text-coral'
        };
      case 'navy':
        return {
          bg: 'bg-navy/10',
          border: 'border-navy/30',
          icon: 'bg-navy text-white',
          accent: 'text-navy'
        };
      default:
        return {
          bg: 'bg-grey-100',
          border: 'border-grey-300',
          icon: 'bg-grey-500 text-white',
          accent: 'text-grey-600'
        };
    }
  };

  return (
    <section id="toolkit" className="py-24 bg-grey-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <Badge className="mb-4 bg-navy/10 text-navy border-navy/20 font-mono">
            <Lightbulb className="w-4 h-4 mr-2" />
            Methodology
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6 font-mono">
            My PM{" "}
            <span className="text-gradient bg-gradient-to-r from-coral to-mint bg-clip-text text-transparent">
              Toolkit
            </span>
          </h2>
          <p className="text-xl text-grey-600 max-w-3xl mx-auto leading-relaxed">
            Interactive deep-dive into how I use tools, frameworks, and methodologies 
            to solve real product challenges. Click any tile to see it in action.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {toolkitItems.map((item, index) => {
            const colors = getColorClasses(item.color);
            const isActive = activeCard === item.id;
            
            return (
              <Card 
                key={item.id}
                className={`p-6 hover-lift transition-smooth cursor-pointer animate-scale-in ${
                  isActive ? 'ring-2 ring-offset-2 ring-mint shadow-lg' : ''
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => setActiveCard(isActive ? null : item.id)}
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${colors.icon} shadow-md`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${colors.bg} ${colors.border} ${colors.accent} font-mono`}
                    >
                      {item.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-mono font-semibold text-navy text-lg">
                      {item.title}
                    </h3>
                    <p className="text-grey-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tools */}
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wide text-grey-500 font-mono">
                      Tools & Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tools.slice(0, isActive ? item.tools.length : 3).map((tool) => (
                        <Badge 
                          key={tool}
                          variant="secondary"
                          className="text-xs bg-white border border-grey-200 text-grey-700 hover:bg-grey-100 transition-smooth"
                        >
                          {tool}
                        </Badge>
                      ))}
                      {!isActive && item.tools.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-grey-200 text-grey-600">
                          +{item.tools.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Expandable scenario */}
                  {isActive && (
                    <div className="space-y-3 animate-slide-up pt-4 border-t border-grey-200">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-coral" />
                        <p className="text-xs uppercase tracking-wide text-grey-500 font-mono">
                          Real-Life Scenario
                        </p>
                      </div>
                      <p className="text-grey-700 text-sm leading-relaxed italic">
                        "{item.scenario}"
                      </p>
                    </div>
                  )}

                  {/* Click hint */}
                  <div className="text-center pt-2">
                    <span className={`text-xs ${colors.accent} font-mono transition-smooth ${
                      isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                    }`}>
                      {isActive ? 'Click to collapse' : 'Click to see in action'}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Floating insights */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="inline-flex items-center space-x-4 bg-white px-6 py-4 rounded-full shadow-md border border-grey-200">
            <TrendingUp className="h-5 w-5 text-mint" />
            <p className="text-grey-700 font-medium">
              <span className="text-coral font-mono">150+</span> tools mastered, 
              <span className="text-mint font-mono"> 50+</span> products shipped,
              <span className="text-navy font-mono"> 10+</span> teams led
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <p className="text-grey-600 mb-6">
            Want to see how these tools solve your specific product challenges?
          </p>
          <button className="text-coral hover:text-coral-dark font-mono font-semibold transition-smooth hover:underline">
            Let's have a product strategy conversation →
          </button>
        </div>
      </div>
    </section>
  );
}