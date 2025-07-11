import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, Lightbulb, Users, TrendingUp, ChevronRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "E-commerce Checkout Optimization",
    subtitle: "Reducing cart abandonment through user-centered design",
    problem: "67% cart abandonment rate was causing significant revenue loss",
    approach: [
      "Conducted 20+ user interviews to identify pain points",
      "A/B tested simplified checkout flow with guest option",
      "Integrated real-time shipping calculator",
      "Implemented trust signals and progress indicators"
    ],
    tradeoffs: [
      "Chose mobile-first design over desktop optimization",
      "Prioritized speed over extensive customization options",
      "Focused on core markets rather than international expansion"
    ],
    results: [
      "32% reduction in cart abandonment",
      "$1.2M additional monthly revenue",
      "15% improvement in mobile conversion",
      "4.8/5 user satisfaction score"
    ],
    tags: ["UX Research", "A/B Testing", "Revenue Growth", "Mobile-First"],
    status: "Live",
    timeline: "3 months"
  },
  {
    id: 2,
    title: "AI-Powered Content Recommendation",
    subtitle: "Personalizing user experience with machine learning",
    problem: "Low user engagement and high churn rate on content platform",
    approach: [
      "Collaborated with ML team to design recommendation algorithm",
      "Implemented user behavior tracking and feedback loops",
      "Created content tagging taxonomy for better categorization",
      "Built real-time personalization dashboard for content creators"
    ],
    tradeoffs: [
      "Invested in long-term ML infrastructure over quick wins",
      "Chose interpretability over pure performance metrics",
      "Focused on engagement over immediate monetization"
    ],
    results: [
      "85% increase in daily active users",
      "2.3x improvement in session duration",
      "40% reduction in churn rate",
      "95% user satisfaction with recommendations"
    ],
    tags: ["Machine Learning", "Personalization", "User Engagement", "Data Science"],
    status: "Live",
    timeline: "6 months"
  },
  {
    id: 3,
    title: "Cross-Platform Design System",
    subtitle: "Scaling design consistency across mobile and web",
    problem: "Inconsistent UI/UX across platforms causing user confusion",
    approach: [
      "Audited existing design patterns across all platforms",
      "Created unified component library with design tokens",
      "Established design-to-development handoff process",
      "Built automated testing for visual consistency"
    ],
    tradeoffs: [
      "Short-term development slowdown for long-term efficiency",
      "Standardization over platform-specific optimizations",
      "Investment in tooling over immediate feature development"
    ],
    results: [
      "60% reduction in design-development cycle time",
      "90% code reusability across platforms",
      "45% fewer design inconsistency bugs",
      "Improved team collaboration scores"
    ],
    tags: ["Design Systems", "Cross-Platform", "Developer Experience", "Scalability"],
    status: "In Progress",
    timeline: "4 months"
  }
];

export function ProjectsImpact() {
  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <Badge className="mb-4 bg-coral/10 text-coral border-coral/20 font-mono">
            <Lightbulb className="w-4 h-4 mr-2" />
            Case Studies
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6 font-mono">
            Projects &{" "}
            <span className="text-gradient bg-gradient-to-r from-coral to-mint bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="text-xl text-grey-600 max-w-3xl mx-auto leading-relaxed">
            Real product stories: the messy problems, thoughtful trade-offs, 
            and meaningful outcomes that define great product management.
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <Card 
              key={project.id}
              className="p-8 lg:p-12 hover-lift transition-smooth animate-scale-in"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Project Header */}
                <div className="lg:col-span-3 space-y-4 mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-navy font-mono">
                        {project.title}
                      </h3>
                      <p className="text-grey-600 text-lg">
                        {project.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={project.status === "Live" ? "default" : "secondary"}
                        className={`font-mono ${
                          project.status === "Live" 
                            ? "bg-mint text-navy" 
                            : "bg-coral/10 text-coral"
                        }`}
                      >
                        {project.status}
                      </Badge>
                      <span className="text-sm text-grey-500">
                        {project.timeline}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline"
                        className="text-xs border-grey-300 text-grey-600 hover:bg-grey-100 transition-smooth"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Problem */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-coral"></div>
                    <h4 className="font-mono font-semibold text-navy uppercase tracking-wide text-sm">
                      Problem
                    </h4>
                  </div>
                  <p className="text-grey-700 leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                {/* Approach */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-mint"></div>
                    <h4 className="font-mono font-semibold text-navy uppercase tracking-wide text-sm">
                      Approach
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {project.approach.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-grey-700">
                        <ChevronRight className="h-4 w-4 text-mint mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Results */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-navy"></div>
                    <h4 className="font-mono font-semibold text-navy uppercase tracking-wide text-sm">
                      Results
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {project.results.map((result, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <TrendingUp className="h-4 w-4 text-coral mt-0.5 flex-shrink-0" />
                        <span className="text-grey-700 leading-relaxed font-medium">
                          {result}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trade-offs section spanning full width */}
                <div className="lg:col-span-3 mt-8 pt-8 border-t border-grey-200">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-grey-400"></div>
                      <h4 className="font-mono font-semibold text-navy uppercase tracking-wide text-sm">
                        Key Trade-offs
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {project.tradeoffs.map((tradeoff, idx) => (
                        <div key={idx} className="p-4 bg-grey-50 rounded-lg border border-grey-200">
                          <p className="text-grey-700 text-sm leading-relaxed">
                            {tradeoff}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="lg:col-span-3 flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    className="border-navy text-navy hover:bg-navy hover:text-white transition-smooth hover-lift"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Detailed Case Study
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Section footer */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <p className="text-grey-600 mb-6">
            These are just a few highlights. I love diving deep into the details.
          </p>
          <Button className="bg-navy text-white hover:bg-navy-light transition-smooth hover-lift">
            <Users className="mr-2 h-4 w-4" />
            Let's Discuss Your Product Challenges
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}