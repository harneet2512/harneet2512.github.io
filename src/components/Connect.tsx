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
    action: "harneet2512singh@gmail.com",
    color: "blue",
    type: "primary"
  },
  {
    id: 2,
    title: "LinkedIn",
    subtitle: "Let's connect professionally",
    description: "I share product insights, industry thoughts, and engage with the PM community daily.",
    icon: Linkedin,
    action: "Connect on LinkedIn",
    color: "purple",
    type: "social"
  },
  {
    id: 3,
    title: "Coffee Chat",
    subtitle: "30-min casual conversation",
    description: "Book time for career advice, product feedback, or just to chat about the industry over virtual coffee.",
    icon: Coffee,
    action: "Book a Coffee Chat",
    color: "green",
    type: "meeting"
  },
  {
    id: 4,
    title: "Product Feedback",
    subtitle: "Quick questions & advice",
    description: "Working on something interesting? I'm happy to provide feedback on your product ideas or strategy.",
    icon: MessageCircle,
    action: "Get Quick Feedback",
    color: "blue",
    type: "feedback"
  }
];

export function Connect() {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: 'bg-blue-500 text-white',
          button: 'bg-blue-500 text-white hover:bg-blue-600',
          accent: 'text-blue-300'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          icon: 'bg-purple-500 text-white',
          button: 'bg-purple-500 text-white hover:bg-purple-600',
          accent: 'text-purple-300'
        };
      case 'green':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: 'bg-green-500 text-white',
          button: 'bg-green-500 text-white hover:bg-green-600',
          accent: 'text-green-300'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/30',
          icon: 'bg-gray-500 text-white',
          button: 'bg-gray-500 text-white hover:bg-gray-600',
          accent: 'text-gray-300'
        };
    }
  };

  return (
    <section id="connect" className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
            <Heart className="w-4 h-4 mr-2" />
            Let's Connect
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-mono">
            Ready to{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Connect?
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Whether you're looking to collaborate, seeking advice, or just want to chat about product strategy - I'm always open to meaningful conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {connectOptions.map((option) => {
            const colors = getColorClasses(option.color);
            const IconComponent = option.icon;
            
            return (
              <Card
                key={option.id}
                className="group relative overflow-hidden border border-gray-800/50 bg-gray-900/30 hover:border-gray-600/50 transition-all duration-200 ease-in-out hover:shadow-2xl hover:scale-[0.97] hover:translate-y-[2px]"
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
                        {option.type}
                      </Badge>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {option.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-800/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
                    >
                      <span className="text-xs">{option.action}</span>
                      <Send className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 md:mt-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 font-mono">
                What to Expect
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm text-gray-300">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Quick response (usually within 24 hours)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Thoughtful, actionable feedback</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>No sales pitches or spam</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}