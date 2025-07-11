import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Calendar, MessageCircle, Coffee, ExternalLink, Send, Heart } from "lucide-react";

const connectOptions = [
  {
    id: 1,
    title: "Email Me",
    subtitle: "For serious conversations",
    description: "Whether it's about a role, collaboration, or just a thoughtful product question - I read every email personally.",
    icon: Mail,
    action: "alex.cook@productmail.com",
    color: "navy",
    type: "primary"
  },
  {
    id: 2,
    title: "LinkedIn",
    subtitle: "Let's connect professionally",
    description: "I share product insights, industry thoughts, and engage with the PM community daily.",
    icon: Linkedin,
    action: "Connect on LinkedIn",
    color: "mint",
    type: "social"
  },
  {
    id: 3,
    title: "Coffee Chat",
    subtitle: "30-min casual conversation",
    description: "Book time for career advice, product feedback, or just to chat about the industry over virtual coffee.",
    icon: Coffee,
    action: "Book a Coffee Chat",
    color: "coral",
    type: "meeting"
  },
  {
    id: 4,
    title: "Product Feedback",
    subtitle: "Quick questions & advice",
    description: "Working on something interesting? I'm happy to provide feedback on your product ideas or strategy.",
    icon: MessageCircle,
    action: "Get Quick Feedback",
    color: "mint",
    type: "feedback"
  }
];

export function Connect() {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'mint':
        return {
          bg: 'bg-mint/10',
          border: 'border-mint/30',
          icon: 'bg-mint text-navy',
          button: 'bg-mint text-navy hover:bg-mint-light',
          accent: 'text-mint'
        };
      case 'coral':
        return {
          bg: 'bg-coral/10',
          border: 'border-coral/30',
          icon: 'bg-coral text-white',
          button: 'bg-coral text-white hover:bg-coral-light',
          accent: 'text-coral'
        };
      case 'navy':
        return {
          bg: 'bg-navy/10',
          border: 'border-navy/30',
          icon: 'bg-navy text-white',
          button: 'bg-navy text-white hover:bg-navy-light',
          accent: 'text-navy'
        };
      default:
        return {
          bg: 'bg-grey-100',
          border: 'border-grey-300',
          icon: 'bg-grey-500 text-white',
          button: 'bg-grey-500 text-white hover:bg-grey-600',
          accent: 'text-grey-600'
        };
    }
  };

  return (
    <section id="connect" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <Badge className="mb-4 bg-mint/10 text-mint border-mint/20 font-mono">
            <Heart className="w-4 h-4 mr-2" />
            Let's Connect
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6 font-mono">
            Ready to{" "}
            <span className="text-gradient bg-gradient-to-r from-coral to-mint bg-clip-text text-transparent">
              Collaborate?
            </span>
          </h2>
          <p className="text-xl text-grey-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're looking for a strategic product partner, have an interesting project, 
            or just want to chat about the product world - I'd love to hear from you.
          </p>
        </div>

        {/* Main CTA Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {connectOptions.map((option, index) => {
            const colors = getColorClasses(option.color);
            
            return (
              <Card 
                key={option.id}
                className="p-6 hover-lift transition-smooth group animate-scale-in cursor-pointer"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`p-4 rounded-xl ${colors.icon} shadow-md group-hover:shadow-lg transition-smooth mx-auto w-fit`}>
                    <option.icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="font-mono font-semibold text-navy text-lg">
                      {option.title}
                    </h3>
                    <p className={`text-sm font-medium ${colors.accent}`}>
                      {option.subtitle}
                    </p>
                    <p className="text-grey-600 text-sm leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  {/* Action */}
                  <Button 
                    className={`w-full ${colors.button} transition-smooth group-hover:shadow-md font-mono text-sm`}
                    size="sm"
                  >
                    {option.type === 'primary' && <Send className="mr-2 h-4 w-4" />}
                    {option.type === 'social' && <ExternalLink className="mr-2 h-4 w-4" />}
                    {option.type === 'meeting' && <Calendar className="mr-2 h-4 w-4" />}
                    {option.type === 'feedback' && <MessageCircle className="mr-2 h-4 w-4" />}
                    {option.action}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Fun personal touch */}
        <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Card className="p-8 lg:p-12 bg-white/80 backdrop-blur-sm border border-grey-200">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center shadow-coral-glow animate-pulse-glow">
                  <Coffee className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-navy font-mono">
                  Coffee Chat Promise
                </h3>
                <p className="text-grey-700 leading-relaxed max-w-2xl mx-auto">
                  I believe the best product conversations happen over coffee (virtual or real). 
                  I'm genuinely excited to learn about what you're building, share what I've learned, 
                  and maybe discover ways we can help each other grow. 
                  <span className="text-coral font-medium"> No pitch decks required - just bring your curiosity!</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-coral text-white hover:bg-coral-light transition-smooth hover-lift font-mono">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule 30 Minutes
                </Button>
                <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white transition-smooth">
                  <Mail className="mr-2 h-4 w-4" />
                  Send a Quick Email
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Response time note */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="inline-flex items-center space-x-2 bg-mint/10 px-4 py-2 rounded-full border border-mint/20">
            <div className="w-2 h-2 rounded-full bg-mint animate-pulse"></div>
            <p className="text-mint text-sm font-mono">
              I typically respond within 24 hours
            </p>
          </div>
        </div>

        {/* Final message */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <p className="text-grey-600 italic max-w-2xl mx-auto leading-relaxed">
            "The best product insights come from conversations with people who see the world differently. 
            I'm always eager to learn from fellow builders, dreamers, and problem-solvers."
          </p>
          <p className="text-navy font-mono font-semibold mt-4">
            - Alex Cook
          </p>
        </div>
      </div>
    </section>
  );
}