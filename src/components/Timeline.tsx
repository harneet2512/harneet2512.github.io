import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Building2, 
  MapPin, 
  Calendar, 
  X,
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  startDate: string; // "2018-09" format
  endDate: string;   // "2022-06" format or "Present"
  type: 'education' | 'experience';
  description: string;
  details: {
    role?: string;
    responsibilities: string[];
    impact: string[];
    technologies?: string[];
    achievements?: string[];
  };
  location?: string;
  logo?: string; // URL to logo image
}

const timelineData: TimelineItem[] = [
  // Education (above timeline)
  {
    id: "manipal-btech",
    title: "Bachelor of Technology in Electrical and Electronics",
    organization: "Manipal Institute of Technology",
    startDate: "2018-07",
    endDate: "2022-07",
    type: "education",
    description: "Bachelor's degree with focus on AI/ML, Data Science, and Programming",
    details: {
      role: "Undergraduate Student",
      responsibilities: [
        "Completed coursework in Machine Learning Tools & Technologies",
        "Studied Data Scientists Toolbox & R Programming",
        "Learned Data Structures & Algorithms fundamentals"
      ],
      impact: [
        "Built strong technical foundation in programming and data science",
        "Developed analytical and problem-solving skills",
        "Gained hands-on experience with ML tools and technologies"
      ],
      technologies: ["Machine Learning", "R Programming", "Data Structures", "Algorithms"],
      achievements: ["AI Research Assistant", "Technical Project Development"]
    },
    location: "Udupi, India",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Manipal_Institute_of_Technology_logo.png/1200px-Manipal_Institute_of_Technology_logo.png"
  },
  {
    id: "cmu-mism",
    title: "Master of Information Systems Management",
    organization: "Carnegie Mellon University",
    startDate: "2024-08",
    endDate: "2025-12",
    type: "education",
    description: "Master's degree focusing on AI/ML, Product Management, and Data Science",
    details: {
      role: "Graduate Student",
      responsibilities: [
        "Completed coursework in Statistics for Managers, Applied Machine Learning",
        "Studied Product Management Essentials and Data Science for Product Managers",
        "Served as Teaching Assistant for Product Management Essentials course"
      ],
      impact: [
        "Gaining expertise in AI/ML applications for product management",
        "Developing strong foundation in data-driven decision making",
        "Building technical and strategic product management skills"
      ],
      technologies: ["Statistics", "Machine Learning", "Product Management", "Data Science"],
      achievements: ["Teaching Assistant", "Product Management Essentials"]
    },
    location: "Pittsburgh, PA",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Carnegie_Mellon_University_seal.svg/1200px-Carnegie_Mellon_University_seal.svg.png"
  },
  // Research (above timeline - treated as work experience)
  {
    id: "manipal-research",
    title: "Undergraduate AI Research Assistant",
    organization: "Manipal Institute of Technology",
    startDate: "2020-10",
    endDate: "2022-01",
    type: "experience",
    description: "Conducted AI research and technical project development",
    details: {
      role: "AI Research Assistant",
      responsibilities: [
        "Conducted research in machine learning and data science applications",
        "Developed technical projects using AI/ML tools and technologies",
        "Collaborated with faculty on research initiatives and publications"
      ],
      impact: [
        "Contributed to AI research projects and technical development",
        "Gained hands-on experience with cutting-edge ML technologies",
        "Built strong foundation for future AI product management work"
      ],
      technologies: ["Machine Learning", "AI Research", "Data Science", "Python", "R"],
      achievements: ["Research Contributions", "Technical Project Development", "AI/ML Expertise"]
    },
    location: "Udupi, India",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Manipal_Institute_of_Technology_logo.png/1200px-Manipal_Institute_of_Technology_logo.png"
  },
  // Work Experience (below timeline)
  {
    id: "ganit-solutions",
    title: "Data Analyst",
    organization: "Ganit Business Solutions",
    startDate: "2022-02",
    endDate: "2022-10",
    type: "experience",
    description: "Delivered data analytics solutions and insights for clients",
    details: {
      role: "Data Analyst",
      responsibilities: [
        "Delivered client-facing data analytics platform integrated with AWS S3",
        "Leveraged SQL-based analytics, Markov analysis, and predictive modeling",
        "Conducted in-depth customer research with regional head managers",
        "Developed and implemented data-driven roster optimization process"
      ],
      impact: [
        "Cut insight delivery time by 80% through self-serve analytics platform",
        "Increased operational efficiency by 20% through roster optimization",
        "Enabled data-driven decision-making for sales and operations teams"
      ],
      technologies: ["AWS S3", "SQL", "Python", "Markov Analysis", "Predictive Modeling", "Streamlit"],
      achievements: ["Client Platform Delivery", "Roster Optimization", "Web Analytics Platform"]
    },
    location: "Chennai, India"
  },
  {
    id: "dolfin-rubbers",
    title: "Product Manager",
    organization: "Dolfin Rubbers",
    startDate: "2023-01",
    endDate: "2024-06",
    type: "experience",
    description: "Led digital transformation and analytics initiatives",
    details: {
      role: "Product Manager",
      responsibilities: [
        "Designed KPI dashboards using Power BI and AWS S3 for procurement and logistics teams",
        "Architected Apache Airflow ETL pipeline development for operational data processing",
        "Spearheaded development of SaaS-style vendor management tool using Streamlit"
      ],
      impact: [
        "Improved demand forecasting accuracy by 25% through centralized metrics",
        "Improved data accessibility by 40% through streamlined ETL processes",
        "Reduced procurement costs by 20% while improving supply chain visibility"
      ],
      technologies: ["Power BI", "AWS S3", "Apache Airflow", "Streamlit", "ETL", "SaaS"],
      achievements: ["Results reviewed in leadership meetings", "Scalable analytics implementation"]
    },
    location: "Punjab, India"
  },
  {
    id: "adskate",
    title: "Product Manager",
    organization: "AdSkate – Corporate Startup Lab, Carnegie Mellon University",
    startDate: "2025-01",
    endDate: "2025-04",
    type: "experience",
    description: "Led product development for AI-powered advertising platform",
    details: {
      role: "Product Manager",
      responsibilities: [
        "Designed and launched embedding-based content recommendation and benchmarking feature",
        "Conducted 15+ user interviews and analyzed competitor platforms",
        "Collaborated with UI/UX on inclusive design for advertisers across regions"
      ],
      impact: [
        "Boosted adoption by 40% through new recommendation features",
        "Improved ROAS through competitive benchmarking capabilities",
        "Guided feature prioritization and roadmap based on user research"
      ],
      technologies: ["A/B Testing", "User Research", "UI/UX Design", "Embeddings", "Benchmarking"],
      achievements: ["Feature Launch", "User Research Leadership", "Cross-functional Collaboration"]
    },
    location: "Pittsburgh, PA"
  },
  {
    id: "connective-rx",
    title: "AI Product Manager Intern",
    organization: "ConnectiveRx",
    startDate: "2025-05",
    endDate: "2025-08",
    type: "experience",
    description: "Led AI-powered automation initiatives and product development",
    details: {
      role: "AI Product Manager Intern",
      responsibilities: [
        "Defined product roadmap for LLM-powered automation framework using Amazon Q Developer",
        "Developed AI-powered workflow generation system and authored PRD for PDF-to-code conversion",
        "Led launch of no-code AI agent for claims PDF processing and data extraction"
      ],
      impact: [
        "Reduced manual QA effort by 55% across 10+ backend services",
        "Cut build time by 70% through automated code generation",
        "Reduced processing time by 60% through AI-powered data extraction"
      ],
      technologies: ["Amazon Q Developer", "LLM", "AI Automation", "PRD", "AI Agents"],
      achievements: ["Presented impact to executive leadership", "Collaborated with ML/AI engineers"]
    },
    location: "Pittsburgh, PA"
  }
];

// Calculate position percentage based on date
function calculatePosition(startDate: string, endDate: string): number {
  const start = new Date(startDate + "-01");
  const end = endDate === "Present" ? new Date() : new Date(endDate + "-01");
  const midDate = new Date((start.getTime() + end.getTime()) / 2);
  
  const timelineStart = new Date("2018-01-01");
  const timelineEnd = new Date("2026-01-01"); // Extended timeline to 2026 for more space
  const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
  const position = midDate.getTime() - timelineStart.getTime();
  
  return Math.max(0, Math.min(100, (position / totalDuration) * 100));
}

// Calculate adjusted position with spacing for clarity
function calculateAdjustedPosition(item: TimelineItem): number {
  const basePosition = calculatePosition(item.startDate, item.endDate);
  
  // Adjust positions for better visual clarity and timeline accuracy
  if (item.id === "cmu-mism") {
    // Emphasize CMU started in mid-2024 (August)
    return Math.max(0, basePosition - 3);
  } else if (item.id === "adskate") {
    // Emphasize AdSkate started in January 2025
    return Math.max(0, basePosition - 1);
  } else if (item.id === "connective-rx") {
    // Move ConnectiveRx slightly to the right for spacing
    return Math.min(100, basePosition + 2);
  }
  
  return basePosition;
}

// Calculate lane position to prevent overlap
function calculateLane(items: TimelineItem[], currentItem: TimelineItem, position: number): number {
  const overlappingItems = items.filter(item => {
    if (item.id === currentItem.id) return false;
    
    const itemPosition = calculateAdjustedPosition(item);
    const itemEnd = item.endDate === "Present" ? new Date() : new Date(item.endDate + "-01");
    const currentEnd = currentItem.endDate === "Present" ? new Date() : new Date(currentItem.endDate + "-01");
    const itemStart = new Date(item.startDate + "-01");
    const currentStart = new Date(currentItem.startDate + "-01");
    
    // Check if items overlap in time
    return !(itemEnd < currentStart || currentEnd < itemStart);
  });
  
  // Find the first available lane
  const usedLanes = overlappingItems.map(item => {
    const itemPosition = calculateAdjustedPosition(item);
    const distance = Math.abs(position - itemPosition);
    // If items are very close horizontally, they need different lanes
    return distance < 15 ? 1 : 0;
  });
  
  return usedLanes.includes(1) ? 1 : 0;
}

// Generate years from 2018 to 2026
function generateYears(): number[] {
  const years = [];
  for (let year = 2018; year <= 2026; year++) {
    years.push(year);
  }
  return years;
}

const years = generateYears();

export function Timeline() {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const educationItems = timelineData.filter(item => item.type === 'education');
  const experienceItems = timelineData.filter(item => item.type === 'experience');

  return (
    <section id="timeline" className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
            <MapPin className="w-4 h-4 mr-2" />
            Professional Journey
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-mono">
            My{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Timeline
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            A visual journey through my education and professional experience, 
            showcasing the milestones that shaped my product management career.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
                     {/* Timeline container with centered layout */}
           <div className="relative min-h-[500px] md:min-h-[600px] mb-12 md:mb-16">
             {/* Education row (top) */}
             <div className="absolute top-0 left-0 right-0 h-64 md:h-80">
              {educationItems.map((item) => {
                const timelinePosition = calculatePosition(item.startDate, item.endDate);
                const isHovered = hoveredItem === item.id;
                const isSelected = selectedItem?.id === item.id;
                
                return (
                  <TimelineLogo
                    key={item.id}
                    item={item}
                    position="top"
                    isSelected={isSelected}
                    isHovered={isHovered}
                    onSelect={() => setSelectedItem(item)}
                    onHover={() => setHoveredItem(item.id)}
                    onLeave={() => setHoveredItem(null)}
                  />
                );
              })}
            </div>

            {/* Timeline line that stops at Present */}
            <div className="absolute top-1/2 left-0 h-0.5 bg-gray-600 transform -translate-y-1/2" style={{ width: '100%' }}></div>
            
            {/* Year markers */}
            {years.map((year) => (
              <div
                key={year}
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${((year - 2018) / (2026 - 2018)) * 100}%` }}
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
                  {year}
                </div>
              </div>
            ))}
            
            {/* Present marker */}
            <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2" style={{ left: '100%' }}>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-blink"></div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-green-400 font-mono">
                Present
              </div>
            </div>

            {/* Vertical connection lines for education items */}
            {educationItems.map((item) => {
              const timelinePosition = calculateAdjustedPosition(item);
              const isHovered = hoveredItem === item.id;
              const isSelected = selectedItem?.id === item.id;
              
              // Calculate lane for this item
              const allEducationItems = timelineData.filter(i => i.type === 'education');
              const lane = calculateLane(allEducationItems, item, timelinePosition);
              const laneOffset = lane * 20;
              
              return (
                <div
                  key={`line-${item.id}`}
                  className={`absolute w-0.5 transition-all duration-300 ${
                    isHovered || isSelected ? 'bg-blue-400 shadow-sm' : 'bg-gray-600'
                  }`}
                  style={{
                    left: `${timelinePosition}%`,
                    top: `${28 + laneOffset}px`, // Start at the bottom edge of the bubble + lane offset
                    height: `calc(50% - ${28 + laneOffset}px)`, // Subtract the bubble height and lane offset
                    transform: 'translateX(-50%)'
                  }}
                />
              );
            })}

            {/* Vertical connection lines for experience items */}
            {experienceItems.map((item) => {
              const timelinePosition = calculateAdjustedPosition(item);
              const isHovered = hoveredItem === item.id;
              const isSelected = selectedItem?.id === item.id;
              
              // Calculate lane for this item
              const allExperienceItems = timelineData.filter(i => i.type === 'experience');
              const lane = calculateLane(allExperienceItems, item, timelinePosition);
              const laneOffset = lane * 20;
              
              return (
                <div
                  key={`line-${item.id}`}
                  className={`absolute w-0.5 transition-all duration-300 ${
                    isHovered || isSelected ? 'bg-purple-400 shadow-sm' : 'bg-gray-600'
                  }`}
                  style={{
                    left: `${timelinePosition}%`,
                    bottom: `${28 + laneOffset}px`, // Start at the top edge of the bubble + lane offset
                    height: `calc(50% - ${28 + laneOffset}px)`, // Subtract the bubble height and lane offset
                    transform: 'translateX(-50%)'
                  }}
                />
              );
            })}

                         {/* Experience row (bottom) */}
             <div className="absolute bottom-0 left-0 right-0 h-64 md:h-80">
              {experienceItems.map((item) => {
                const timelinePosition = calculatePosition(item.startDate, item.endDate);
                const isHovered = hoveredItem === item.id;
                const isSelected = selectedItem?.id === item.id;
                
                return (
                  <TimelineLogo
                    key={item.id}
                    item={item}
                    position="bottom"
                    isSelected={isSelected}
                    isHovered={isHovered}
                    onSelect={() => setSelectedItem(item)}
                    onHover={() => setHoveredItem(item.id)}
                    onLeave={() => setHoveredItem(null)}
                  />
                );
              })}
            </div>
          </div>

          {/* Mobile-friendly timeline list for smaller screens */}
          <div className="block md:hidden space-y-6">
            {timelineData.map((item) => (
              <Card
                key={item.id}
                className={`p-4 md:p-6 border transition-all duration-200 ease-in-out cursor-pointer hover:scale-[0.97] hover:translate-y-[2px] hover:shadow-xl ${
                  selectedItem?.id === item.id
                    ? 'border-blue-400 bg-blue-500/10'
                    : 'border-gray-800 hover:border-gray-600 bg-gray-900/50'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    item.type === 'education' ? 'bg-blue-400' : 'bg-purple-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={`text-xs ${
                        item.type === 'education' 
                          ? 'border-blue-400 text-blue-300' 
                          : 'border-purple-400 text-purple-300'
                      }`}>
                        {item.type === 'education' ? 'Education' : 'Experience'}
                      </Badge>
                      <span className="text-xs text-gray-400 font-mono">
                        {item.startDate.split('-')[0]} - {item.endDate === 'Present' ? 'Present' : item.endDate.split('-')[0]}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{item.organization}</p>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview Modal */}
        {selectedItem && (
          <TimelinePreview
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>
    </section>
  );
}

interface TimelineLogoProps {
  item: TimelineItem;
  position: 'top' | 'bottom';
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}

function TimelineLogo({ item, position, isSelected, isHovered, onSelect, onHover, onLeave }: TimelineLogoProps) {
  const Icon = item.type === 'education' ? GraduationCap : Building2;
  const bgColor = item.type === 'education' ? 'bg-blue-500' : 'bg-purple-500';
  const timelinePosition = calculateAdjustedPosition(item);
  
  // Get all items of the same type for lane calculation
  const allItems = position === 'top' ? 
    timelineData.filter(i => i.type === 'education') : 
    timelineData.filter(i => i.type === 'experience');
  
  const lane = calculateLane(allItems, item, timelinePosition);
  const laneOffset = lane * 20; // 20px offset for second lane

  return (
    <div
      className="absolute transform -translate-x-1/2 cursor-pointer group"
      style={{ 
        left: `${timelinePosition}%`,
        top: position === 'top' ? `${laneOffset}px` : `calc(100% - ${laneOffset}px)`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Logo circle with enhanced interactions */}
      <button
        className={`relative w-14 h-14 rounded-full ${bgColor} border-3 border-gray-800 shadow-md 
          transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg
          ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-60 scale-110 shadow-xl' : 'scale-100'}
          ${isHovered ? 'scale-105 shadow-lg' : ''}
          transform hover:rotate-2 active:scale-95 overflow-hidden`}
        onClick={onSelect}
      >
        {/* Show logo if available, otherwise show icon */}
        {item.logo ? (
          <img 
            src={item.logo} 
            alt={`${item.organization} logo`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const iconElement = target.nextElementSibling as HTMLElement;
              if (iconElement) iconElement.style.display = 'block';
            }}
          />
        ) : null}
        
        {/* Fallback icon (hidden if logo is shown) */}
        <Icon 
          className={`w-7 h-7 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            transition-transform duration-300 group-hover:scale-110 ${item.logo ? 'hidden' : 'block'}`} 
        />
        
        {/* Pulse animation for selected state */}
        {isSelected && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25"></div>
        )}

        {/* Hover glow effect */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full bg-white opacity-15 animate-pulse"></div>
        )}
      </button>

             {/* Enhanced tooltip */}
       <div 
         className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 pointer-events-none ${
           isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
         }`}
         style={{
           marginTop: position === 'top' ? `${8 + laneOffset}px` : undefined,
           marginBottom: position === 'bottom' ? `${8 + laneOffset}px` : undefined,
           transform: position === 'bottom' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)'
         }}
       >
        <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap border border-gray-700">
          <div className="font-semibold">{item.organization}</div>
          <div className="text-gray-300 text-xs mt-1">{item.title}</div>
        </div>
        <div className={`w-0 h-0 border-l-4 border-r-4 mx-auto ${
          position === 'top' 
            ? 'border-t-4 border-transparent border-t-gray-800' 
            : 'border-b-4 border-transparent border-b-gray-800'
        }`}></div>
      </div>
    </div>
  );
}

interface TimelinePreviewProps {
  item: TimelineItem;
  onClose: () => void;
}

function TimelinePreview({ item, onClose }: TimelinePreviewProps) {
  const Icon = item.type === 'education' ? GraduationCap : Building2;
  const bgColor = item.type === 'education' ? 'bg-blue-500' : 'bg-purple-500';

  return (
    <Card className="p-8 shadow-xl border border-gray-700 bg-[#111] backdrop-blur-sm">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center space-x-6">
          <div className={`p-4 rounded-2xl ${bgColor} text-white shadow-lg transform hover:scale-105 transition-transform duration-200 overflow-hidden`}>
            {item.logo ? (
              <img 
                src={item.logo} 
                alt={`${item.organization} logo`}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const iconElement = target.nextElementSibling as HTMLElement;
                  if (iconElement) iconElement.style.display = 'block';
                }}
              />
            ) : null}
            <Icon className={`w-8 h-8 ${item.logo ? 'hidden' : 'block'}`} />
          </div>
                     <div className="flex-1">
             <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
             <p className="text-xl text-gray-300 mb-3">{item.organization}</p>
           </div>
           
                       {/* Date and Location on the right */}
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                {item.startDate.split('-')[0]} - {item.endDate === 'Present' ? 'Present' : item.endDate.split('-')[0]}
              </div>
              {item.location && (
                <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  {item.location}
                </div>
              )}
            </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-full p-2 transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left column */}
        <div className="space-y-8">
          {item.details.role && (
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Role
              </h4>
              <p className="text-gray-300">{item.details.role}</p>
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-xl">
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Key Responsibilities
            </h4>
            <ul className="space-y-3">
              {item.details.responsibilities.slice(0, 3).map((responsibility, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-300 text-sm leading-relaxed">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          {item.details.technologies && (
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.details.technologies.slice(0, 5).map((tech) => (
                  <Badge key={tech} variant="secondary" className="bg-gray-700 text-gray-300 text-xs border border-gray-600 hover:bg-blue-500 hover:text-white transition-colors duration-200">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-8">
                     <div className="bg-gray-800 p-6 rounded-xl">
             <h4 className="font-semibold text-white mb-4 flex items-center">
               <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
               Impact & Achievements
             </h4>
             <ul className="space-y-3">
               {item.details.impact.slice(0, 3).map((impact, index) => (
                 <li key={index} className="flex items-start space-x-3 group">
                   <div className="w-1.5 h-1.5 bg-purple-300 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                   <span className="text-gray-300 text-sm leading-relaxed">{impact}</span>
                 </li>
               ))}
             </ul>
           </div>

                     {item.details.achievements && (
             <div className="bg-gray-800 p-6 rounded-xl">
               <h4 className="font-semibold text-white mb-4 flex items-center">
                 <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                 Academic Involvement
               </h4>
               <div className="flex items-start space-x-3 group">
                 <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                 <span className="text-gray-300 text-sm leading-relaxed">Teaching Assistant Product Management Essentials</span>
               </div>
             </div>
           )}
        </div>
      </div>
    </Card>
  );
} 