import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Heart, Copy, Send } from "lucide-react";

const connectOptions = [
  {
    id: 1,
    title: "Email",
    subtitle: "Drop me a line",
    description: "Whether it's about a role, collaboration, or just to say hi - I love hearing from fellow product people and always try to respond quickly!",
    icon: Mail,
    action: "harneet2512singh@gmail.com",
    color: "blue",
    type: "primary"
  },
  {
    id: 2,
    title: "LinkedIn",
    subtitle: "Let's connect",
    description: "Join my network on LinkedIn where I share thoughts on product, tech trends, and occasionally some behind-the-scenes of my PM journey.",
    icon: Linkedin,
    action: "https://www.linkedin.com/in/harneetbali/",
    color: "purple",
    type: "social"
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

  const handleEmailAction = (action: string, type: string) => {
    if (type === 'primary') {
      if (action === 'copy') {
        // Copy email to clipboard
        navigator.clipboard.writeText(connectOptions[0].action);
        // You could add a toast notification here
      } else if (action === 'send') {
        // Open default email client with pre-populated email
        const email = connectOptions[0].action;
        const subject = encodeURIComponent("Hello Harneet - Let's Connect!");
        const body = encodeURIComponent("Hi Harneet,\n\nI'd love to connect with you!\n\nBest regards,\n[Your Name]");
        const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
      }
    } else if (type === 'social') {
      // Open LinkedIn in new tab
      window.open(connectOptions[1].action, '_blank');
    }
  };

  return (
    <section id="connect" className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto w-full px-4 md:px-6 lg:px-8 relative z-10" style={{ maxWidth: "min(92vw, 1760px)" }}>
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
            <Heart className="w-4 h-4 mr-2" />
            Let's Chat
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-mono text-white font-light tracking-tight mb-4 md:mb-6">
            Let's Connect
          </h2>
          <p className="text-lg md:text-xl font-mono text-gray-400 font-light max-w-3xl mx-auto px-4">
            Always excited to meet fellow product enthusiasts, discuss interesting opportunities, or just chat about the latest in tech and product management.
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
                    {option.type === 'primary' ? (
                      // Email options - two buttons side by side
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
                          onClick={() => handleEmailAction('copy', option.type)}
                        >
                          <Copy className="w-3 h-3 mr-2" />
                          <span className="text-xs">Copy Email</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                          onClick={() => handleEmailAction('send', option.type)}
                        >
                          <Send className="w-3 h-3 mr-2" />
                          <span className="text-xs">Send Email</span>
                        </Button>
                      </div>
                    ) : (
                      // LinkedIn - single button
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-white text-black border-white hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-300"
                        onClick={() => handleEmailAction('', option.type)}
                      >
                        <span className="text-xs">Connect on LinkedIn</span>
                        <Linkedin className="w-3 h-3 ml-2" />
                      </Button>
                    )}
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
                  <span>Quick responses (usually same day!)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Friendly and helpful conversations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>No spam, just genuine connections</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}