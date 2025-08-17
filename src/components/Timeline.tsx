import React, { useState, useEffect } from "react";
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
        "Completed coursework in Machine Learning Tools & Technologies with TensorFlow and PyTorch",
        "Studied Data Scientists Toolbox & R Programming for statistical analysis and modeling",
        "Learned Data Structures & Algorithms through practical programming assignments",
        "Participated in AI/ML research projects and technical workshops"
      ],
      impact: [
        "Built strong technical foundation in programming and data science",
        "Developed analytical and problem-solving skills",
        "Gained hands-on experience with ML tools and technologies"
      ],
      technologies: ["Deep Learning", "TensorFlow", "PyTorch", "Python", "R Programming", "Machine Learning", "Data Science", "Neural Networks", "Computer Vision", "Natural Language Processing", "Data Structures", "Algorithms", "Statistical Analysis", "Predictive Modeling", "AI Research", "Technical Programming"],
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
        "Completed advanced coursework in Statistics and Applied Machine Learning",
        "Studied Product Management Essentials and Data Science for Product Managers",
        "Served as Teaching Assistant for Product Management Essentials course",
        "Participated in industry projects and case studies"
      ],
      impact: [
        "Gaining expertise in AI/ML applications for product management",
        "Developing strong foundation in data-driven decision making",
        "Building technical and strategic product management skills"
      ],
      technologies: ["Advanced Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Python", "Statistics", "Product Management", "Data Science", "AI/ML Applications", "Predictive Analytics", "Business Intelligence", "User Research", "Product Strategy", "Data Visualization", "Statistical Modeling", "A/B Testing", "Product Analytics"],
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
        "Collaborated with faculty on research initiatives and publications",
        "Mentored junior students in AI/ML concepts and project development"
      ],
      impact: [
        "Contributed to AI research projects and technical development",
        "Gained hands-on experience with cutting-edge ML technologies",
        "Built strong foundation for future AI product management work"
      ],
      technologies: ["Deep Learning", "TensorFlow", "PyTorch", "Python", "R Programming", "Machine Learning", "AI Research", "Data Science", "Neural Networks", "Computer Vision", "Natural Language Processing", "Research Publications", "Image Classification", "Text Analysis", "Neural Network Architecture", "Data Preprocessing", "Model Training", "Research Methodology", "Academic Writing", "Technical Presentations"],
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
        "Delivered client-facing data analytics platform integrated with AWS S3, cutting insight delivery time by 80%",
        "Leveraged SQL-based analytics, Markov analysis, and predictive modeling for customer insights",
        "Conducted customer research with regional managers to optimize data solutions",
        "Developed data-driven roster optimization process increasing operational efficiency by 20%"
      ],
      impact: [
        "Cut insight delivery time by 80% through self-serve analytics platform",
        "Increased operational efficiency by 20% through roster optimization",
        "Enabled data-driven decision-making for sales and operations teams"
      ],
      technologies: ["AWS S3", "Advanced SQL", "Python", "Deep Learning", "TensorFlow", "Markov Analysis", "Predictive Modeling", "Streamlit", "Machine Learning", "Data Analytics", "Statistical Analysis", "Data Visualization", "ETL Processes", "Business Intelligence"],
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
        "Designed KPI dashboards using Power BI and AWS S3, improving demand forecasting accuracy by 25%",
        "Architected Apache Airflow ETL pipeline development, improving data accessibility by 40%",
        "Spearheaded SaaS-style vendor management tool using Streamlit, reducing procurement costs by 20%"
      ],
      impact: [
        "Improved demand forecasting accuracy by 25% through centralized metrics",
        "Improved data accessibility by 40% through streamlined ETL processes",
        "Reduced procurement costs by 20% while improving supply chain visibility"
      ],
      technologies: ["Power BI", "AWS S3", "Apache Airflow", "Streamlit", "ETL", "SaaS", "Deep Learning", "TensorFlow", "Python", "Machine Learning", "Predictive Analytics", "Data Engineering", "Cloud Architecture", "Data Visualization", "Business Intelligence", "Supply Chain Analytics", "Vendor Management Systems"],
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
        "Defined go-to-market strategy for semantic benchmarking feature, increasing adoption by 40%",
        "Conducted 15+ user interviews and analyzed competitor platforms for feature prioritization",
        "Designed and launched embedding-based content recommendation and benchmarking feature"
      ],
      impact: [
        "Boosted adoption by 40% through new recommendation features",
        "Improved ROAS through competitive benchmarking capabilities",
        "Guided feature prioritization and roadmap based on user research"
      ],
      technologies: ["Deep Learning", "TensorFlow", "PyTorch", "Python", "Embeddings", "A/B Testing", "User Research", "UI/UX Design", "Machine Learning", "AI/ML", "Recommendation Systems", "Computer Vision", "Natural Language Processing", "Semantic Analysis", "AdTech", "Product Strategy", "Go-to-Market", "Competitive Analysis"],
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
        "Led enterprise-quality AI agent for claims PDF processing, reducing processing time by 60%",
        "Defined roadmap for LLM-powered test automation framework, cutting manual QA effort by 55%",
        "Authored PRD and led AI-powered workflow generation system, reducing build time by 70%"
      ],
      impact: [
        "Reduced manual QA effort by 55% across 10+ backend services",
        "Cut build time by 70% through automated code generation",
        "Reduced processing time by 60% through AI-powered data extraction"
      ],
      technologies: ["Deep Learning", "TensorFlow", "PyTorch", "Python", "LLM", "Large Language Models", "AI Automation", "Amazon Q Developer", "Neural Networks", "Computer Vision", "Natural Language Processing", "AI Agents", "Machine Learning", "PDF Processing", "OCR", "Document Intelligence", "Test Automation", "Workflow Generation", "Code Generation", "AI Product Management", "Stakeholder Management", "Cross-functional Leadership"],
      achievements: ["Presented impact to executive leadership", "Collaborated with ML/AI engineers"]
    },
    location: "Pittsburgh, PA"
  }
];

// Custom year-to-position mapping for hybrid spacing
const yearPositions: { [key: number | string]: number } = {
  2018: 0,
  2019: 8,
  2020: 16,
  2021: 24,
  2022: 35,
  2023: 46,
  2024: 57,
  2025: 68,
  'Present': 78,
  2026: 88
};

// Calculate position percentage based on custom mapping
function calculatePosition(startDate: string, endDate: string): number {
  const start = new Date(startDate + "-01");
  const end = endDate === "Present" ? new Date() : new Date(endDate + "-01");
  const midDate = new Date((start.getTime() + end.getTime()) / 2);
  
  const year = midDate.getFullYear();
  const month = midDate.getMonth();
  
  // Interpolate between years for more precise positioning
  if (yearPositions[year] !== undefined) {
    const nextYear = year + 1;
    if (yearPositions[nextYear] !== undefined) {
      // Linear interpolation between years based on month
      const yearProgress = month / 12;
      const currentPos = yearPositions[year];
      const nextPos = yearPositions[nextYear];
      return currentPos + (nextPos - currentPos) * yearProgress;
    }
    return yearPositions[year];
  }
  
  // Fallback for edge cases
  return Math.max(0, Math.min(88, ((year - 2018) / (2026 - 2018)) * 88));
}

// Calculate adjusted position with better spacing for clarity
function calculateAdjustedPosition(item: TimelineItem): number {
  const basePosition = calculatePosition(item.startDate, item.endDate);
  
  // Adjust positions for better visual clarity and prevent overlap
  if (item.id === "cmu-mism") {
    return Math.max(0, basePosition - 2);
  } else if (item.id === "adskate") {
    return Math.max(0, basePosition - 1);
  } else if (item.id === "connective-rx") {
    return Math.min(88, basePosition + 1);
  }
  
  return basePosition;
}

// Calculate lane position to prevent overlap with improved spacing
function calculateLane(items: TimelineItem[], currentItem: TimelineItem, position: number): number {
  const overlappingItems = items.filter(item => {
    if (item.id === currentItem.id) return false;
    
    const itemPosition = calculateAdjustedPosition(item);
    const itemEnd = item.endDate === "Present" ? new Date() : new Date(item.endDate + "-01");
    const currentEnd = currentItem.endDate === "Present" ? new Date() : new Date(currentItem.endDate + "-01");
    const itemStart = new Date(item.startDate + "-01");
    const currentStart = new Date(currentItem.startDate + "-01");
    
    // Check if items overlap in time with more generous spacing
    return !(itemEnd < currentStart || currentEnd < itemStart);
  });
  
  // Find the first available lane with improved spacing logic
  const usedLanes = overlappingItems.map(item => {
    const itemPosition = calculateAdjustedPosition(item);
    const distance = Math.abs(position - itemPosition);
    // If items are close horizontally, they need different lanes
    return distance < 20 ? 1 : 0;
  });
  
  return usedLanes.includes(1) ? 1 : 0;
}

// Generate years from 2018 to 2025 with better spacing (2026 handled separately)
function generateYears(): number[] {
  const years = [];
  for (let year = 2018; year <= 2025; year++) {
    years.push(year);
  }
  return years;
}

const years = generateYears();

export function Timeline() {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Set ConnectiveRx as default selected item
  useEffect(() => {
    const defaultItem = timelineData.find(item => item.id === "connective-rx");
    if (defaultItem) {
      setSelectedItem(defaultItem);
    }
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const educationItems = timelineData.filter(item => item.type === 'education');
  const experienceItems = timelineData.filter(item => item.type === 'experience');

  return (
    <section id="timeline" className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto w-full px-4 md:px-6 lg:px-8 relative z-10" style={{ maxWidth: "min(92vw, 1760px)" }}>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-mono text-white font-light tracking-tight mb-4 md:mb-6">
            Timeline
          </h2>
          <p className="text-lg md:text-xl font-mono text-gray-400 font-light px-4">
            My journey from engineering to AI product management
          </p>
          <p className="text-sm md:text-base font-mono text-gray-500 font-light mt-3 px-4 max-w-2xl mx-auto">
            {isMobile 
              ? 'Use the visual timeline above to explore my journey'
              : 'Hover over and click on timeline items to explore my experiences in detail'
            }
          </p>
        </div>

        <div className="max-w-7xl w-full mx-auto" style={{ maxWidth: "min(92vw, 1760px)" }}>
          {/* Timeline container with improved spacing */}
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

            {/* Timeline line that extends properly */}
            <div className="absolute top-1/2 left-0 h-0.5 bg-gray-700/60 transform -translate-y-1/2" style={{ width: '88%' }}></div>
            
            {/* Year markers with hybrid spacing */}
            {years.map((year) => (
              <div
                key={year}
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${yearPositions[year]}%` }}
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
                  {year}
                </div>
              </div>
            ))}
            
            {/* Present marker with hybrid spacing */}
            <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2" style={{ left: `${yearPositions['Present']}%` }}>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-sm text-green-400 font-mono font-semibold">
                Present
              </div>
            </div>

            {/* 2026 marker positioned after Present to avoid overlap */}
            <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2" style={{ left: `${yearPositions[2026]}%` }}>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
                2026
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
              const laneOffset = lane * 25; // Increased offset for better spacing
              
              return (
                <div
                  key={`line-${item.id}`}
                  className={`absolute w-0.5 transition-all duration-300 ${
                    isHovered || isSelected ? 'bg-blue-400 shadow-sm' : 'bg-gray-600'
                  }`}
                  style={{
                    left: `${timelinePosition}%`,
                    top: `${28 + laneOffset}px`,
                    height: `calc(50% - ${28 + laneOffset}px)`,
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
              const laneOffset = lane * 25; // Increased offset for better spacing
              
              return (
                <div
                  key={`line-${item.id}`}
                  className={`absolute w-0.5 transition-all duration-300 ${
                    isHovered || isSelected ? 'bg-purple-400 shadow-sm' : 'bg-gray-600'
                  }`}
                  style={{
                    left: `${timelinePosition}%`,
                    bottom: `${28 + laneOffset}px`,
                    height: `calc(50% - ${28 + laneOffset}px)`,
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
          <div className="block md:hidden">
            {/* Mobile shows only the visual timeline - no cards */}
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm mb-3">
                Use the interactive timeline above to explore my journey
              </p>
              <p className="text-blue-300 text-xs opacity-80">
                💡 Tip: Tap on timeline items to see details
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 md:mt-12">
            <p className="text-gray-400 text-sm md:text-base mb-3 font-light">
              {isMobile ? 'Tap on any timeline item above to explore more of my journey' : 'Click on any timeline item above to explore more of my journey'}
            </p>
            <p className="text-blue-300 text-xs md:text-sm font-mono opacity-80">
              {isMobile ? '💡 Tip: Tap timeline items to see details' : '💡 Tip: Hover over timeline items to see details'}
            </p>
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
  const laneOffset = lane * 25; // Increased offset for better spacing

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
    <Card className="p-8 shadow-xl border border-gray-700 bg-[#111] backdrop-blur-sm max-w-6xl w-full mx-auto" style={{ maxWidth: "min(92vw, 1760px)" }}>
      <header className="relative mb-8">
        {/* Left: icon + title + company */}
        <div className="flex items-start gap-3 pr-0 md:pr-48">
          <div className={`p-4 rounded-2xl ${bgColor} text-white shadow-lg transform hover:scale-105 transition-transform duration-200 overflow-hidden shrink-0 h-10 w-10 grid place-items-center`}>
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
          <div>
            <h3 className="text-2xl md:text-3xl font-mono text-white font-semibold mb-2 tracking-tight">{item.title}</h3>
            <p className="text-lg md:text-xl text-white font-medium mb-3">{item.organization}</p>
          </div>
        </div>

        {/* Right: date + location badges */}
        <div className="
            mt-3 md:mt-0
            flex flex-wrap items-center gap-2
            md:absolute md:top-6 md:right-14 md:justify-end
          ">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm text-white font-medium">
            <Calendar className="h-4 w-4" />
            <span>{item.startDate.split('-')[0]} - {item.endDate === 'Present' ? 'Present' : item.endDate.split('-')[0]}</span>
          </span>
          {item.location && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm text-white font-medium">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-[240px] md:max-w-[320px]">{item.location}</span>
            </span>
          )}
        </div>

        {/* Close button - positioned absolutely in top-right corner */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-full p-2 transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left column */}
        <div className="space-y-6">
          {item.details.role && (
            <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-600/50">
              <h4 className="font-bold text-white mb-3 flex items-center text-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Role
              </h4>
              <p className="text-white font-medium">{item.details.role}</p>
            </div>
          )}

          <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-600/50">
            <h4 className="font-bold text-white mb-4 flex items-center text-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Key Responsibilities
            </h4>
            <ul className="space-y-3">
              {item.details.responsibilities.slice(0, 3).map((responsibility, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-white text-sm leading-relaxed font-medium">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-600/50">
            <h4 className="font-bold text-white mb-4 flex items-center text-lg">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
              Impact & Achievements
            </h4>
            <ul className="space-y-3">
              {item.details.impact.slice(0, 3).map((impact, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <div className="w-1.5 h-1.5 bg-purple-300 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                  <span className="text-white text-sm leading-relaxed font-medium">{impact}</span>
                </li>
              ))}
            </ul>
          </div>

          {item.details.achievements && (
            <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-600/50">
              <h4 className="font-bold text-white mb-4 flex items-center text-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                {item.organization === "Carnegie Mellon University" ? "Academic Involvement" : "Key Achievements"}
              </h4>
              <div className="space-y-3">
                {item.details.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                    <span className="text-white text-sm leading-relaxed font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technologies & Tools - Full width bottom section */}
      {item.details.technologies && (
        <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-600/50">
          <h4 className="font-bold text-white mb-4 flex items-center text-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            Technologies & Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {item.details.technologies.slice(0, 8).map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-gray-700 text-white text-xs border border-gray-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 px-3 py-1.5 rounded-full font-medium">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}