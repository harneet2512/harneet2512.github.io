import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, Lightbulb, Users, TrendingUp, ChevronRight, Clock, AlertCircle, Target, Scale } from "lucide-react";

// Project interface
interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  problem: string;
  approach: string[];
  tradeoffs: string[];
  results: string[];
  tags: string[];
  status: string;
  timeline: string;
  image: string;
  featured: boolean;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Chess Analysis Tool",
    subtitle: "AI-powered chess game analysis with Stockfish integration",
    description: "Developed a comprehensive chess web application using Django backend and React frontend, featuring custom game logic, Stockfish chess engine integration for move recommendations, and user authentication system.",
    problem: "Need for accessible chess analysis tools with AI-powered insights",
    approach: [
      "Built custom chess game logic without external libraries",
      "Integrated Stockfish chess engine for optimal move suggestions",
      "Implemented secure user authentication and session management",
      "Created responsive web interface for cross-platform accessibility"
    ],
    tradeoffs: [
      "Custom implementation over existing chess libraries for full control",
      "Backend-heavy processing for real-time analysis",
      "Focused on core analysis features over advanced game modes"
    ],
    results: [
      "Fully functional chess game with custom piece logic",
      "AI-powered move recommendations using Stockfish engine",
      "Secure user authentication system",
      "Responsive web interface for all devices"
    ],
    tags: ["Django", "React", "AI Integration", "Game Development", "Python"],
    status: "Live",
    timeline: "4 months",
    image: "/placeholder.svg",
    featured: true,
    githubUrl: "https://github.com/harneet2512/Chess_Analysis"
  },
  {
    id: 2,
    title: "Optic Disc and Cup Segmentation",
    subtitle: "AI-powered medical imaging for glaucoma diagnosis",
    description: "Developed a computer vision system for automatic segmentation of optic disc and cup from retinal fundus images, enabling accurate cup-to-disc ratio (CDR) measurement for glaucoma diagnosis and monitoring.",
    problem: "Manual measurement of optic disc and cup ratios is time-consuming and prone to human error in glaucoma diagnosis",
    approach: [
      "Implemented advanced image processing algorithms for retinal fundus analysis",
      "Built automated segmentation models for optic disc and cup detection",
      "Developed CDR calculation system for clinical decision support",
      "Created validation framework using ground truth medical annotations"
    ],
    tradeoffs: [
      "Precision over processing speed for medical accuracy requirements",
      "Investment in specialized medical imaging algorithms over generic CV solutions",
      "Focus on clinical validation over rapid prototyping"
    ],
    results: [
      "Automated optic disc and cup segmentation from fundus images",
      "Accurate CDR measurement for glaucoma classification",
      "Clinical-grade precision for medical diagnosis support",
      "Reduced manual analysis time for ophthalmologists"
    ],
    tags: ["Computer Vision", "Medical AI", "Image Segmentation", "Python", "Healthcare"],
    status: "Live",
    timeline: "5 months",
    image: "/placeholder.svg",
    featured: false,
    githubUrl: "https://github.com/harneet2512/Optic-Disc-and-cup-segmentaation"
  },
  {
    id: 3,
    title: "ResumeCoach-AI",
    subtitle: "Autonomous agent-powered resume tailoring system using LLMs",
    description: "Built an intelligent resume optimization system that automatically tailors resumes to job descriptions using Large Language Models, extracts key skills, rewrites bullet points, and implements Redis caching for efficient reuse.",
    problem: "Manual resume customization for each job application is time-consuming and often inconsistent",
    approach: [
      "Developed autonomous agent system powered by LLMs for intelligent resume parsing",
      "Implemented job post analysis to extract key skills and requirements",
      "Built automated bullet point rewriting engine with context awareness",
      "Integrated Redis caching system for efficient reuse of past optimizations"
    ],
    tradeoffs: [
      "AI-powered automation over manual customization control",
      "Investment in LLM infrastructure over traditional rule-based systems",
      "Focus on intelligent parsing over simple keyword matching"
    ],
    results: [
      "Automated resume tailoring for any job description",
      "Intelligent skill extraction and bullet point optimization",
      "Efficient caching system reducing processing time",
      "Consistent quality across multiple applications"
    ],
    tags: ["LLM", "AI Agents", "Redis", "Automation", "Python"],
    status: "In Progress",
    timeline: "3 months",
    image: "/placeholder.svg",
    featured: false,
    githubUrl: "https://github.com/harneet2512/ResumeCoach-AI"
  },
  {
    id: 4,
    title: "AQI-Prediction",
    subtitle: "IEEE Published Research on Air Quality Index Prediction using Neural Networks",
    description: "Published research paper proposing a novel method for estimating Air Quality Index (AQI) in Delhi, India using Principal Component Analysis (PCA), multiple regression, and Artificial Neural Networks (ANNs) to improve prediction accuracy.",
    problem: "Traditional methods for AQI prediction lack accuracy and fail to capture complex relationships between environmental factors",
    approach: [
      "Implemented PCA to identify most significant factors influencing AQI",
      "Applied multiple regression analysis on identified factors",
      "Built and trained ANN models on processed data for complex pattern recognition",
      "Integrated meteorological and air quality data for comprehensive analysis"
    ],
    tradeoffs: [
      "Research depth over rapid implementation for academic rigor",
      "Complex ANN architecture over simple statistical models",
      "Comprehensive data analysis over quick results"
    ],
    results: [
      "IEEE published research paper on AQI prediction methodology",
      "Improved accuracy compared to traditional prediction methods",
      "Identified key environmental factors affecting Delhi's air quality",
      "Established framework for air quality forecasting in urban areas"
    ],
    tags: ["Machine Learning", "Neural Networks", "PCA", "Environmental Science", "Research", "Python"],
    status: "Published",
    timeline: "6 months",
    image: "/placeholder.svg",
    featured: false,
    githubUrl: "https://github.com/harneet2512/AQI-Prediction"
  },
  {
    id: 5,
    title: "Customer Support Automation",
    subtitle: "Reducing response times with AI chatbots",
    description: "Implemented AI-powered customer support that reduced average response time by 80% and improved customer satisfaction scores by 35% through intelligent automation and human oversight.",
    problem: "Long customer support response times affecting satisfaction",
    approach: [
      "Integrated AI chatbot for common inquiries",
      "Implemented intelligent ticket routing system",
      "Created knowledge base for self-service support",
      "Established human oversight for complex cases"
    ],
    tradeoffs: [
      "Automation over personalized human interaction",
      "Standardized responses over custom solutions",
      "Investment in AI infrastructure over immediate cost savings"
    ],
    results: [
      "80% reduction in average response time",
      "35% improvement in customer satisfaction",
      "60% decrease in support ticket volume",
      "24/7 availability for common issues"
    ],
    tags: ["AI", "Customer Support", "Automation", "Satisfaction"],
    status: "Live",
    timeline: "5 months",
    image: "/placeholder.svg",
    featured: false
  }
];

export function ProjectsImpact() {
  return (
    <section id="projects" className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
            <Lightbulb className="w-4 h-4 mr-2" />
            Case Studies
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-mono">
            Project{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Real-world projects that demonstrate measurable business impact through strategic product thinking and user-centered design.
          </p>
        </div>

        {/* Featured Project - Top Row */}
        <div className="mb-8">
          {projects.filter(project => project.featured).map((project) => (
            <Card
              key={project.id}
              className="group relative overflow-hidden border border-gray-800/50 bg-gray-900/30 hover:border-blue-500/30 transition-all duration-200 ease-in-out hover:shadow-2xl hover:scale-[0.97] hover:translate-y-[2px]"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                                 <Badge 
                   variant="outline" 
                   className={`text-xs font-mono ${
                     project.status === 'Live' 
                       ? 'border-green-400 text-green-300' 
                       : project.status === 'Published'
                       ? 'border-blue-400 text-blue-300'
                       : 'border-yellow-400 text-yellow-300'
                   }`}
                 >
                   {project.status}
                 </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                 {/* Image Column */}
                 <div className="relative h-64 lg:h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-r border-gray-800/50">
                   <div className="absolute inset-0 bg-gray-800/20 rounded-l-xl"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     {project.id === 1 ? (
                       <video 
                         className="w-full h-full object-cover rounded-l-xl"
                         autoPlay 
                         muted 
                         loop 
                         playsInline
                       >
                         <source src="/chess_preview.mp4" type="video/mp4" />
                         Your browser does not support the video tag.
                       </video>
                     ) : (
                       <div className="text-center">
                         <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                           <Lightbulb className="w-8 h-8 text-blue-400" />
                         </div>
                         <p className="text-sm text-gray-400 font-mono">Project Preview</p>
                       </div>
                     )}
                   </div>
                 </div>

                {/* Content Column */}
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3 group-hover:text-blue-300 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-lg text-gray-300 mb-4">
                      {project.subtitle}
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {project.description}
                    </p>
                                         <div className="flex flex-wrap gap-2 mb-4">
                       {project.tags.map((tag) => (
                         <Badge
                           key={tag}
                           variant="outline"
                           className="text-xs border-gray-600 text-gray-300 font-mono hover:bg-blue-500 hover:text-white hover:border-blue-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
                         >
                           {tag}
                         </Badge>
                       ))}
                     </div>
                    <div className="flex items-center text-xs text-gray-500 font-mono">
                      <Clock className="w-3 h-3 mr-1" />
                      {project.timeline}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-800/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      <span className="text-xs">View on GitHub</span>
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Secondary Projects - Two Rows */}
        <div className="space-y-6">
                     {/* Second Row - Two Projects */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {projects.filter(project => !project.featured).slice(0, 2).map((project) => (
               <Card
                 key={project.id}
                 className="group relative overflow-hidden border border-gray-800/50 bg-gray-900/30 hover:border-blue-500/30 transition-all duration-200 ease-in-out hover:shadow-2xl hover:scale-[0.97] hover:translate-y-[2px]"
               >
                 {/* Status Badge */}
                 <div className="absolute top-4 right-4 z-10">
                   <Badge 
                     variant="outline" 
                     className={`text-xs font-mono ${
                       project.status === 'Live' 
                         ? 'border-green-400 text-green-300' 
                         : project.status === 'Published'
                         ? 'border-blue-400 text-blue-300'
                         : 'border-yellow-400 text-yellow-300'
                     }`}
                   >
                     {project.status}
                   </Badge>
                 </div>

                 {/* Image */}
                 <div className="relative h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                   <div className="absolute inset-0 bg-gray-800/20"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     {project.id === 2 ? (
                       <img 
                         src="/OD__.png" 
                         alt="Optic Disc Segmentation Preview"
                         className="w-full h-full object-cover"
                       />
                     ) : project.id === 3 ? (
                       <img 
                         src="/AGENT.png" 
                         alt="ResumeCoach AI Agent Preview"
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <div className="text-center">
                         <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                           <Lightbulb className="w-6 h-6 text-blue-400" />
                         </div>
                         <p className="text-xs text-gray-400 font-mono">Preview</p>
                       </div>
                       )}
                   </div>
                 </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-100 mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    {project.subtitle}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-gray-600 text-gray-300 font-mono hover:bg-blue-500 hover:text-white hover:border-blue-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 font-mono">
                      <Clock className="w-3 h-3 mr-1" />
                      {project.timeline}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
                      onClick={() => project.githubUrl ? window.open(project.githubUrl, '_blank') : null}
                    >
                      <span>{project.githubUrl ? (project.status === 'Published' ? 'View Research' : 'View on GitHub') : 'View'}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

                     {/* Third Row - Two Projects */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {projects.filter(project => !project.featured).slice(2, 4).map((project) => (
               <Card
                 key={project.id}
                 className="group relative overflow-hidden border border-gray-800/50 bg-gray-900/30 hover:border-blue-500/30 transition-all duration-200 ease-in-out hover:shadow-2xl hover:scale-[0.97] hover:translate-y-[2px]"
               >
                 {/* Status Badge */}
                 <div className="absolute top-4 right-4 z-10">
                   <Badge 
                     variant="outline" 
                     className={`text-xs font-mono ${
                       project.status === 'Live' 
                         ? 'border-green-400 text-green-300' 
                         : project.status === 'Published'
                         ? 'border-blue-400 text-blue-300'
                         : 'border-yellow-400 text-yellow-300'
                     }`}
                   >
                     {project.status}
                   </Badge>
                 </div>

                 {/* Image */}
                 <div className="relative h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                   <div className="absolute inset-0 bg-gray-800/20"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     {project.id === 2 ? (
                       <img 
                         src="/OD__.png" 
                         alt="Optic Disc Segmentation Preview"
                         className="w-full h-full object-cover"
                       />
                     ) : project.id === 3 ? (
                       <img 
                         src="/AGENT.png" 
                         alt="ResumeCoach AI Agent Preview"
                         className="w-full h-full object-cover"
                       />
                     ) : project.id === 4 ? (
                                               <img 
                          src="/delhi AQI.jpeg" 
                          alt="AQI Prediction Research Preview"
                          className="w-full h-full object-cover"
                        />
                     ) : (
                       <div className="text-center">
                         <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                           <Lightbulb className="w-6 h-6 text-blue-400" />
                         </div>
                         <p className="text-xs text-gray-400 font-mono">Preview</p>
                       </div>
                       )}
                   </div>
                 </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-100 mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    {project.subtitle}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-gray-600 text-gray-300 font-mono hover:bg-blue-500 hover:text-white hover:border-blue-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 font-mono">
                      <Clock className="w-3 h-3 mr-1" />
                      {project.timeline}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
                      onClick={() => project.githubUrl ? window.open(project.githubUrl, '_blank') : null}
                    >
                      <span>{project.githubUrl ? (project.status === 'Published' ? 'View Research' : 'View on GitHub') : 'View'}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <Button
            variant="outline"
            size="lg"
            className="bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 font-mono text-base md:text-lg font-medium"
          >
            <span>→ View All Projects</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
}