"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  X, 
  ChevronDown, 
  FileText,
  Megaphone,
  Zap,
  ArrowRight,
  ChevronRight,
  GripVertical,
  Compass,
  Target,
  Scissors,
  Shield,
  Rocket,
  User,
  Star,
  Settings,
  Plus,
  Calendar,
  Users,
  Trash2,
  Globe,
  Menu,
  ArrowLeft
} from 'lucide-react'

interface ChecklistItem {
  id: number
  text: string
  emoji: string
  isTyping: boolean
  isTyped: boolean
  isExpanded: boolean
  isChecked: boolean
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  details: {
    title: string
    explanation: string
    outcomes: string[]
  }
}

interface Tab {
  id: string
  title: string
  content: React.ReactNode
}

const checklistData: Omit<ChecklistItem, 'isTyping' | 'isTyped' | 'isChecked' | 'isExpanded' | 'icon'>[] = [
  {
    id: 1,
    text: "Solve from First Principles",
    emoji: "🧠",
    details: {
      title: "First Principles Thinking",
      explanation: "Break down complex problems into fundamental truths and build solutions from the ground up.",
      outcomes: ["Eliminate assumptions", "Innovative solutions", "Clear reasoning"]
    }
  },
  {
    id: 2,
    text: "Set a Bold, Measurable Vision",
    emoji: "🎯",
    details: {
      title: "Product Vision",
      explanation: "Define a compelling future state that inspires teams and stakeholders.",
      outcomes: ["Clear direction", "Team alignment", "Stakeholder buy-in"]
    }
  },
  {
    id: 3,
    text: "Prototype Fast, Learn Faster",
    emoji: "🌀",
    details: {
      title: "Rapid Prototyping",
      explanation: "Quickly build and test ideas to validate assumptions before full development.",
      outcomes: ["Faster learning", "Risk reduction", "User feedback"]
    }
  },
  {
    id: 4,
    text: "Prioritize for Maximum Impact",
    emoji: "📦",
    details: {
      title: "MVP Prioritization",
      explanation: "Focus on essential features that deliver core value to users.",
      outcomes: ["Faster time to market", "Resource efficiency", "User satisfaction"]
    }
  },
  {
    id: 5,
    text: "Drive Cross-Functional Momentum",
    emoji: "⭐",
    details: {
      title: "Team Alignment",
      explanation: "Ensure all departments work towards common goals with shared understanding.",
      outcomes: ["Reduced conflicts", "Faster execution", "Better outcomes"]
    }
  },
  {
    id: 6,
    text: "Decide with Data & Instinct",
    emoji: "📊",
    details: {
      title: "Data-Driven Decisions",
      explanation: "Combine quantitative insights with qualitative understanding for balanced decision-making.",
      outcomes: ["Informed choices", "Reduced bias", "Better outcomes"]
    }
  },
  {
    id: 7,
    text: "Ship Relentlessly, Iterate Smartly",
    emoji: "🚀",
    details: {
      title: "Continuous Delivery",
      explanation: "Maintain high velocity while ensuring quality and learning from each iteration.",
      outcomes: ["Faster feedback", "Continuous improvement", "Market responsiveness"]
    }
  },
  {
    id: 8,
    text: "Design for Scale & Inclusion",
    emoji: "➡️",
    details: {
      title: "Inclusive Design",
      explanation: "Create solutions that work for diverse users and can grow with your business.",
      outcomes: ["Broader accessibility", "Scalable architecture", "User satisfaction"]
    }
  },
  {
    id: 9,
    text: "Champion User & Business Outcomes",
    emoji: "🧭",
    details: {
      title: "Balanced Success",
      explanation: "Ensure both user needs and business objectives are met for sustainable growth.",
      outcomes: ["User satisfaction", "Business growth", "Long-term success"]
    }
  },
]

const iconArray = [Zap, Target, Shield, Compass, Star, Rocket, Globe, ArrowRight, User]

const NotionInterface: React.FC = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() =>
    checklistData.map((item, index) => ({
      ...item,
      isTyping: false,
      isTyped: true,
      isChecked: false,
      isExpanded: false,
      icon: iconArray[index] || Zap
    }))
  )
  
  const [openTabs, setOpenTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [dragItem, setDragItem] = useState<number | null>(null)
  const [dragOverItem, setDragOverItem] = useState<number | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [touchDevice, setTouchDevice] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  
  const [fullScreenView, setFullScreenView] = useState<{
    isOpen: boolean
    type: 'architecture' | 'caseStudy' | 'demo'
    title: string
  }>({
    isOpen: false,
    type: 'architecture',
    title: ''
  })

  // Enhanced device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setOrientation(height > width ? 'portrait' : 'landscape')
      setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
      
      if (width < 768) {
        setSidebarCollapsed(true)
      } else if (width >= 1024) {
        setSidebarCollapsed(false)
      }
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)
    
    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleItemClick = (item: ChecklistItem) => {
    setMobileMenuOpen(false)
    
    if (openTabs.length >= 3) {
      setActiveTab(null)
      return
    }

    const newTab: Tab = {
      id: `tab-${item.id}`,
      title: item.text,
      content: (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <span className="text-4xl sm:text-5xl lg:text-6xl">{item.emoji}</span>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 lg:mb-3">{item.details.title}</h2>
              <p className="text-lg sm:text-xl text-gray-400">{item.text}</p>
            </div>
          </div>
          
          <div className="space-y-4 lg:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Explanation</h3>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                {item.details.explanation}
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Key Outcomes</h3>
              <ul className="space-y-2">
                {item.details.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-center gap-3 text-base sm:text-lg text-gray-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    }

    if (!openTabs.find(tab => tab.id === newTab.id)) {
      setOpenTabs(prev => [...prev, newTab])
    }
    
    setActiveTab(newTab.id)
  }

  const closeTab = (tabId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTab === tabId) {
      setActiveTab(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, itemId: number) => {
    if (touchDevice) {
      e.preventDefault()
      return
    }
    setDragItem(itemId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, itemId: number) => {
    e.preventDefault()
    if (dragItem !== itemId) {
      setDragOverItem(itemId)
    }
  }

  const handleDrop = (e: React.DragEvent, itemId: number) => {
    e.preventDefault()
    if (dragItem !== null && dragItem !== itemId) {
      const items = [...checklistItems]
      const dragIndex = items.findIndex(item => item.id === dragItem)
      const dropIndex = items.findIndex(item => item.id === itemId)
      
      if (dragIndex !== -1 && dropIndex !== -1) {
        const [draggedItem] = items.splice(dragIndex, 1)
        items.splice(dropIndex, 0, draggedItem)
        setChecklistItems(items)
      }
    }
    setDragItem(null)
    setDragOverItem(null)
  }

  const handleDragEnd = () => {
    setDragItem(null)
    setDragOverItem(null)
  }

  const handleFullScreenView = (type: 'architecture' | 'caseStudy' | 'demo', title: string) => {
    setFullScreenView({
      isOpen: true,
      type,
      title
    })
  }

  const closeFullScreenView = () => {
    setFullScreenView({
      isOpen: false,
      type: 'architecture',
      title: ''
    })
  }

  const handleProjectClick = (title: string) => {
    setMobileMenuOpen(false)
    
    if (openTabs.length >= 3) {
      setActiveTab(null)
      return
    }

    const getProjectContent = (projectTitle: string) => {
      const commonStructure = (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <span className="text-4xl sm:text-5xl lg:text-6xl">🚀</span>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 lg:mb-3">{projectTitle}</h2>
              <p className="text-lg sm:text-xl text-gray-400">Project Case Study</p>
            </div>
          </div>
          
          <div className="space-y-4 lg:space-y-6">
            {projectTitle === 'Agentic Claims PDF Processing Agent' && (
              <>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Summary</h3>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    A no-code AI agent that parses complex claims PDFs into structured data and integrates with internal systems.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Impact</h3>
                  <p className="text-base sm:text-lg text-gray-300">60% faster claims processing</p>
                </div>
                <div>
                  <button
                    onClick={() => handleFullScreenView('architecture', projectTitle)}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm text-white/80 border border-white/20 rounded-md hover:bg-white/5 hover:text-white/90 transition-colors"
                  >
                    See Architecture
                  </button>
                </div>
              </>
            )}

            {projectTitle === 'PDF-to-Frontend Code Generation' && (
              <>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Summary</h3>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    An AI-powered workflow that converts static PDF designs into production-ready front-end code.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Impact</h3>
                  <p className="text-base sm:text-lg text-gray-300">70% faster build cycles</p>
                </div>
                <div>
                  <button
                    onClick={() => handleFullScreenView('caseStudy', projectTitle)}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm text-white/80 border border-white/20 rounded-md hover:bg-white/5 hover:text-white/90 transition-colors"
                  >
                    See Case Study
                  </button>
                </div>
              </>
            )}

            {projectTitle === 'Semantic Benchmarking for AdTech' && (
              <>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Summary</h3>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    A benchmarking feature enabling advertisers to A/B test creative messaging and compare against competitors.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Impact</h3>
                  <p className="text-base sm:text-lg text-gray-300">40% boost in feature adoption</p>
                </div>
                <div>
                  <button
                    onClick={() => handleFullScreenView('demo', projectTitle)}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm text-white/80 border border-white/20 rounded-md hover:bg-white/5 hover:text-white/90 transition-colors"
                  >
                    See Demo
                  </button>
                </div>
              </>
            )}

            {projectTitle === 'Data & Vendor Management at Scale' && (
              <>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Summary</h3>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    Data infrastructure and tools to improve forecasting accuracy and vendor performance.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 lg:mb-4">Impact</h3>
                  <p className="text-base sm:text-lg text-gray-300">25% more accurate forecasting, 20% lower procurement costs</p>
                </div>
                <div>
                  <button
                    onClick={() => handleFullScreenView('caseStudy', projectTitle)}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm text-white/80 border border-white/20 rounded-md hover:bg-white/5 hover:text-white/90 transition-colors"
                  >
                    See Case Study
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )
      return commonStructure
    }

    const newTab: Tab = {
      id: `project-${title.replace(/\s+/g, '-').toLowerCase()}`,
      title: title,
      content: getProjectContent(title)
    }

    if (!openTabs.find(tab => tab.id === newTab.id)) {
      setOpenTabs(prev => {
        if (prev.length >= 3) {
          return [...prev.slice(1), newTab]
        }
        return [...prev, newTab]
      })
    }
    
    setActiveTab(newTab.id)
  }

  const getContainerHeight = () => {
    if (isMobile) {
      return orientation === 'portrait' 
        ? 'h-[calc(100vh-8rem)]' 
        : 'h-[calc(100vh-4rem)]'
    }
    return 'h-[60vh] sm:h-[600px] lg:h-[700px] xl:h-[800px]'
  }

  return (
    <div className="w-full relative z-10 flex justify-end lg:justify-end px-2 sm:px-4 lg:pr-32 xl:pr-40">
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md border border-gray-600/60 rounded-2xl sm:rounded-3xl shadow-2xl p-1 sm:p-2 lg:p-3 relative w-full max-w-[57vw] lg:max-w-[840px] xl:max-w-[960px] ring-1 ring-gray-500/20">
        
        {/* Window Title Bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/95 to-gray-700/95 border-b border-gray-600/50 rounded-t-xl sm:rounded-t-2xl px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 mb-1 sm:mb-2 backdrop-blur-sm">
          {/* Window Controls */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-red-500/90 hover:bg-red-400 transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-yellow-500/90 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-green-500/90 hover:bg-green-400 transition-colors cursor-pointer"></div>
          </div>
          
          {/* Window Title */}
          <div className="flex items-center gap-2 sm:gap-3 text-gray-200 text-xs sm:text-sm lg:text-base font-semibold flex-shrink min-w-0">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500/80 rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] sm:text-xs">🧠</span>
            </div>
            <span className="tracking-wide truncate">
              <span className="hidden sm:inline">My Product Brain (The Harneet Method)</span>
              <span className="sm:hidden">Product Brain</span>
            </span>
          </div>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
          
          {/* Desktop Window Actions */}
          {!isMobile && (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500/60 rounded-md hover:bg-gray-400/80 transition-colors cursor-pointer"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500/60 rounded-md hover:bg-gray-400/80 transition-colors cursor-pointer"></div>
            </div>
          )}
        </div>

        {/* Main Interface Container */}
        <div className={`bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#333] rounded-xl sm:rounded-2xl shadow-2xl ${getContainerHeight()} w-full relative ring-1 ring-gray-600/30`}>
          <div className="flex h-full min-w-0">
            
            {/* Mobile Overlay Menu */}
            {isMobile && mobileMenuOpen && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
                <div className="w-64 bg-gradient-to-b from-[#1a1a1a] to-[#222] border-r border-[#444] h-full overflow-y-auto">
                  <div className="p-4 space-y-6">
                    {/* Close Button */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Navigation</h3>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Workspace Header */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-base shadow-lg">
                        HB
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-base truncate">Harneet Bali</div>
                        <div className="text-blue-200 text-sm truncate">Brainspace</div>
                      </div>
                    </div>

                    {/* Back Button */}
                    <button 
                      onClick={() => {
                        setActiveTab(null)
                        setOpenTabs([])
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-base">Back to Main</span>
                    </button>

                    {/* Private Pages */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Private</div>
                      <button 
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          !activeTab 
                            ? 'bg-[#333] text-white' 
                            : 'hover:bg-[#333] text-gray-300 hover:text-white'
                        }`}
                        onClick={() => {
                          setActiveTab(null)
                          setMobileMenuOpen(false)
                        }}
                      >
                        <FileText className="w-5 h-5" />
                        <span className="text-base">My Product Brain</span>
                      </button>
                    </div>

                    {/* How I Built It */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">How I Built It</div>
                      <div className="space-y-1">
                        <button 
                          className="w-full text-left p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white hover:underline text-sm leading-tight"
                          onClick={() => handleProjectClick('Agentic Claims PDF Processing Agent')}
                        >
                          Agentic Claims PDF Processing Agent
                        </button>
                        <button 
                          className="w-full text-left p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white hover:underline text-sm leading-tight"
                          onClick={() => handleProjectClick('PDF-to-Frontend Code Generation')}
                        >
                          PDF-to-Frontend Code Generation
                        </button>
                        <button 
                          className="w-full text-left p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white hover:underline text-sm leading-tight"
                          onClick={() => handleProjectClick('Semantic Benchmarking for AdTech')}
                        >
                          Semantic Benchmarking for AdTech
                        </button>
                        <button 
                          className="w-full text-left p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white hover:underline text-sm leading-tight"
                          onClick={() => handleProjectClick('Data & Vendor Management at Scale')}
                        >
                          Data & Vendor Management at Scale
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>
            )}

            {/* Desktop Left Sidebar */}
            {!isMobile && (
              <div className={`min-w-0 flex-shrink-0 bg-gradient-to-b from-[#1a1a1a] to-[#222] border-r border-[#444] transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64 lg:w-72'}`}>
                <div className="h-full overflow-y-auto p-4 space-y-6">
                  {/* Workspace Header */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-base shadow-lg flex-shrink-0">
                      HB
                    </div>
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-base truncate">Harneet Bali</div>
                        <div className="text-blue-200 text-sm truncate">Brainspace</div>
                      </div>
                    )}
                  </div>

                  {/* Toggle Sidebar Button */}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white group"
                  >
                    <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
                    {!sidebarCollapsed && <span className="text-base">Collapse</span>}
                  </button>

                  {/* Back Button */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setActiveTab(null)
                        setOpenTabs([])
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white group"
                    >
                      <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                      {!sidebarCollapsed && <span className="text-base truncate">Back to Main</span>}
                    </button>
                  </div>

                  {/* Private Pages */}
                  <div className="space-y-2">
                    <div className={`text-sm font-medium text-gray-500 uppercase tracking-wider ${sidebarCollapsed ? 'text-center' : ''}`}>
                      {!sidebarCollapsed && 'Private'}
                    </div>
                    <div className="space-y-1">
                      <button 
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          !activeTab 
                            ? 'bg-[#333] text-white' 
                            : 'hover:bg-[#333] text-gray-300 hover:text-white'
                        }`}
                        onClick={() => setActiveTab(null)}
                      >
                        <FileText className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span className="text-base truncate">My Product Brain</span>}
                      </button>
                    </div>
                  </div>

                  {/* How I Built It */}
                  <div className="space-y-2">
                    <div className={`text-sm font-medium text-gray-500 uppercase tracking-wider ${sidebarCollapsed ? 'text-center' : ''}`}>
                      {!sidebarCollapsed && 'How I Built It'}
                    </div>
                    <div className="space-y-1">
                      {!sidebarCollapsed && (
                        <>
                          <button 
                            className="w-full text-left p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white hover:underline text-sm leading-tight break-words min-w-0"
                            onClick={() => handleProjectClick('Agentic Claims PDF Processing Agent')}
                          >
                            <span className="break-words">Agentic Claims PDF Processing Agent</span>
                          </button>
                          <button 
                            className="w-full text-left p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white hover:underline text-sm leading-tight break-words min-w-0"
                            onClick={() => handleProjectClick('PDF-to-Frontend Code Generation')}
                          >
                            <span className="break-words">PDF-to-Frontend Code Generation</span>
                          </button>
                          <button 
                            className="w-full text-left p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white hover:underline text-sm leading-tight break-words min-w-0"
                            onClick={() => handleProjectClick('Semantic Benchmarking for AdTech')}
                          >
                            <span className="break-words">Semantic Benchmarking for AdTech</span>
                          </button>
                          <button 
                            className="w-full text-left p-3 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white hover:underline text-sm leading-tight break-words min-w-0"
                            onClick={() => handleProjectClick('Data & Vendor Management at Scale')}
                          >
                            <span className="break-words">Data & Vendor Management at Scale</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-4 border-t border-[#333] space-y-2">
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white">
                      <User className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span className="text-base truncate">User</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="min-w-0 flex-1 flex flex-col h-full relative">
              {/* Tabs */}
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border-b border-[#444] flex items-center flex-shrink-0 z-10 shadow-sm min-w-0">
                {/* Home tab */}
                <div
                  className={`px-1.5 sm:px-2 lg:px-3 py-2 sm:py-3 cursor-pointer border-r border-[#444] transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
                    !activeTab
                      ? 'bg-gradient-to-r from-[#2a2a2a] to-[#333] text-white shadow-inner'
                      : 'bg-transparent text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                  }`}
                  onClick={() => setActiveTab(null)}
                >
                  <span className="mr-1 sm:mr-1.5 text-sm sm:text-base">🏠</span> 
                  <span className="hidden sm:inline">My Product Brain</span>
                  <span className="sm:hidden">Home</span>
                </div>
                
                {/* Dynamic tabs */}
                {openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`px-1 sm:px-1.5 lg:px-2 py-2 sm:py-3 cursor-pointer border-r border-[#444] transition-all duration-200 flex-shrink-0 min-w-0 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#2a2a2a] to-[#333] text-white shadow-inner'
                        : 'bg-transparent text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="truncate max-w-[40px] sm:max-w-[60px] lg:max-w-[70px] text-sm sm:text-base">{tab.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors text-lg font-bold flex-shrink-0 ml-0.5 w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 flex flex-col min-h-0 relative">
                {/* Main Content */}
                <div className="min-w-0 flex-1 overflow-y-auto">
                  <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
                    {/* Page Header */}
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6 mb-6 sm:mb-8 lg:mb-10">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-lg sm:text-xl lg:text-2xl">🧠</span>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                          <span className="hidden sm:inline">My Product Brain (The Harneet Method)</span>
                          <span className="sm:hidden">Product Brain</span>
                        </h1>
                      </div>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl">
                        A comprehensive framework for building successful products, from ideation to execution.
                      </p>
                    </div>

                    {/* Tab Limit Error Message */}
                    {openTabs.length >= 3 && (
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          <div className="text-2xl sm:text-3xl lg:text-4xl">🚫</div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-red-300 mb-2">Tab Limit Reached</h3>
                            <p className="text-xs sm:text-sm lg:text-base text-red-200/80">
                              You have hit the maximum of 3 tabs! Close one to explore more content. 
                              <span className="text-red-300 font-semibold"> Keep it focused, stay productive! 🚀</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Checklist */}
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                      {checklistItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <div
                            key={item.id}
                            draggable={!touchDevice}
                            onDragStart={!touchDevice ? (e: React.DragEvent) => handleDragStart(e, item.id) : undefined}
                            onDragOver={!touchDevice ? (e: React.DragEvent) => handleDragOver(e, item.id) : undefined}
                            onDrop={!touchDevice ? (e: React.DragEvent) => handleDrop(e, item.id) : undefined}
                            onDragEnd={!touchDevice ? (e: React.DragEvent) => handleDragEnd() : undefined}
                            onClick={() => handleItemClick(item)}
                            className="cursor-pointer select-none"
                          >
                            <div
                              className={`bg-[#171717] border border-[#262626] rounded-lg sm:rounded-[14px] p-3 sm:p-3 lg:p-4 transition-all duration-200 group will-change-transform hover:bg-[#1a1a1a] active:scale-[0.98] ${
                                !prefersReducedMotion ? 'hover:-translate-y-0.5' : ''
                              }`}
                              style={{
                                boxShadow: prefersReducedMotion ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                            >
                              <div className="flex items-center gap-3 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                                <div className="flex items-center justify-center w-6 h-6 sm:w-6 sm:h-6 lg:w-8 lg:h-8 relative flex-shrink-0">
                                  <IconComponent 
                                    className="w-5 h-5 sm:w-5 sm:h-5 lg:w-7 lg:h-7 relative z-10"
                                    style={{ 
                                      color: ['#fbbf24', '#c084fc', '#fde047', '#f59e0b', '#22c55e', '#f97316'][index % 6]
                                    }}
                                  />
                                </div>
                                <span className="text-sm sm:text-base lg:text-lg xl:text-xl transition-colors duration-200 min-w-0 flex-1 text-gray-200 group-hover:text-white leading-tight">
                                  <span className="break-words">{item.text}</span>
                                </span>
                                {isMobile && (
                                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-300 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tab content overlay */}
                {activeTab && (
                  <div className="absolute inset-0 bg-[#121212] z-30">
                    <div className="h-full overflow-y-auto">
                      {openTabs.find(tab => tab.id === activeTab)?.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Overlay */}
      {fullScreenView.isOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4"
          onClick={closeFullScreenView}
        >
          <div 
            className="bg-[#1a1a1a] border border-[#333] rounded-lg sm:rounded-xl shadow-2xl w-full h-full sm:h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: isMobile ? '100vw' : '95vw',
              maxHeight: isMobile ? '100vh' : '95vh',
              width: isMobile ? '100vw' : '95vw',
              height: isMobile ? '100vh' : '95vh'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#333]">
              <h2 className="text-lg sm:text-2xl font-semibold text-white truncate">
                {fullScreenView.type === 'architecture' && 'Architecture'}
                {fullScreenView.type === 'caseStudy' && 'Case Study'}
                {fullScreenView.type === 'demo' && 'Demo'}
                <span className="hidden sm:inline">: {fullScreenView.title}</span>
              </h2>
              <button
                onClick={closeFullScreenView}
                className="text-gray-400 hover:text-white transition-colors text-xl sm:text-2xl w-8 h-8 flex items-center justify-center"
                aria-label="Close full screen view"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
              {fullScreenView.type === 'architecture' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 sm:p-8 text-center">
                    <div className="text-4xl sm:text-8xl mb-4">🏗️</div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-4">System Architecture</h3>
                    <p className="text-base sm:text-xl text-gray-300 mb-6">
                      Interactive architecture diagram showing the complete system flow
                    </p>
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 sm:p-6">
                      <div className="text-3xl sm:text-6xl mb-4">📊</div>
                      <p className="text-sm sm:text-lg text-gray-400">Architecture visualization coming soon...</p>
                    </div>
                  </div>
                </div>
              )}

              {fullScreenView.type === 'caseStudy' && (
                <div className="space-y-4 sm:space-y-8">
                  <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 sm:p-8">
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Detailed Case Study</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                      <div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Process</h4>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Comprehensive analysis of the development process, challenges faced, and solutions implemented.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Results</h4>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Detailed metrics, outcomes, and impact measurements from the project implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 sm:p-6">
                    <p className="text-center text-sm sm:text-base text-gray-400">Full case study content coming soon...</p>
                  </div>
                </div>
              )}

              {fullScreenView.type === 'demo' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 sm:p-8 text-center">
                    <div className="text-4xl sm:text-8xl mb-4">🎥</div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-4">Interactive Demo</h3>
                    <p className="text-base sm:text-xl text-gray-300 mb-6">
                      Live demonstration of the feature in action
                    </p>
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 sm:p-6 aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl sm:text-6xl mb-4">▶️</div>
                        <p className="text-sm sm:text-lg text-gray-400">Demo video coming soon...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotionInterface