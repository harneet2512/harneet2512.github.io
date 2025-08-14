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
    color: "blue"
  },
  {
    id: 2,
    category: "AI & Automation", 
    icon: Brain,
    title: "AI-Powered Solutions",
    description: "Leveraging ML for product innovation",
    tools: ["TensorFlow", "OpenAI API", "Recommendation Systems", "NLP", "AutoML"],
    scenario: "Built a customer support chatbot that reduced ticket volume by 60% while maintaining 4.5/5 satisfaction scores.",
    color: "purple"
  },
  {
    id: 3,
    category: "User Research",
    icon: Users2,
    title: "Human-Centered Design",
    description: "Understanding users beyond demographics",
    tools: ["User Interviews", "Usability Testing", "Surveys", "Journey Mapping", "Personas"],
    scenario: "Conducted 50+ user interviews that revealed a critical gap in our assumptions, pivoting our roadmap and saving 6 months of development.",
    color: "green"
  },
  {
    id: 4,
    category: "Strategy & Planning",
    icon: Target,
    title: "Strategic Thinking",
    description: "From vision to execution",
    tools: ["OKRs", "Roadmapping", "Competitive Analysis", "Market Research", "Business Cases"],
    scenario: "Developed a 3-year product strategy that aligned 4 cross-functional teams and resulted in 200% user growth.",
    color: "blue"
  },
  {
    id: 5,
    category: "Agile & Process",
    icon: Zap,
    title: "Agile Excellence", 
    description: "Building high-performing teams",
    tools: ["Scrum", "Kanban", "Jira", "Confluence", "Retrospectives"],
    scenario: "Transformed a struggling team's velocity by 150% through process optimization and better stakeholder communication.",
    color: "purple"
  },
  {
    id: 6,
    category: "Technical Collaboration",
    icon: Code,
    title: "Technical Partnership",
    description: "Bridge between business and engineering",
    tools: ["APIs", "Technical Specs", "System Design", "Git", "Figma"],
    scenario: "Worked with engineers to design a scalable architecture that reduced page load times by 70% while cutting infrastructure costs.",
    color: "green"
  }
];

export function PMToolkit() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: 'bg-blue-500 text-white',
          accent: 'text-blue-300'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30', 
          icon: 'bg-purple-500 text-white',
          accent: 'text-purple-300'
        };
      case 'green':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: 'bg-green-500 text-white',
          accent: 'text-green-300'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/30',
          icon: 'bg-gray-500 text-white',
          accent: 'text-gray-300'
        };
    }
  };

  return (
    <section id="toolkit" className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
            <Lightbulb className="w-4 h-4 mr-2" />
            Product Management Toolkit
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-mono">
            My{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Toolkit
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            A comprehensive set of tools, methodologies, and frameworks I use to solve complex product challenges and drive measurable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {toolkitItems.map((item) => {
            const colors = getColorClasses(item.color);
            const IconComponent = item.icon;
            
            return (
              <Card
                key={item.id}
                className={`group relative overflow-hidden border transition-all duration-200 ease-in-out hover:shadow-2xl hover:scale-[0.97] hover:translate-y-[2px] cursor-pointer ${
                  activeCard === item.id 
                    ? `${colors.border} ${colors.bg}` 
                    : 'border-gray-800/50 bg-gray-900/30 hover:border-gray-600/50'
                }`}
                onClick={() => setActiveCard(activeCard === item.id ? null : item.id)}
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-mono mb-2 ${colors.border} ${colors.accent}`}
                      >
                        {item.category}
                      </Badge>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <Badge
                          key={tool}
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-300 font-mono"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Scenario */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Real-World Scenario</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {item.scenario}
                    </p>
                  </div>

                  {/* Expandable Details */}
                  {activeCard === item.id && (
                    <div className="mt-6 pt-6 border-t border-gray-800/50 animate-slide-up">
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-2">Key Outcomes</h5>
                          <ul className="space-y-2">
                            <li className="text-sm text-gray-300 flex items-start">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              Measurable impact on business metrics
                            </li>
                            <li className="text-sm text-gray-300 flex items-start">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              Improved user experience and satisfaction
                            </li>
                            <li className="text-sm text-gray-300 flex items-start">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              Scalable and sustainable solutions
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-2">Methodology</h5>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            Systematic approach combining data analysis, user research, and iterative development to ensure solutions are both effective and user-centered.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-800/50">
                    <button className="text-xs text-gray-400 hover:text-blue-300 transition-colors duration-300 font-mono">
                      {activeCard === item.id ? 'Show Less' : 'Learn More'}
                    </button>
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