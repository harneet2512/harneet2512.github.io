"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
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
  Globe
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

// Icon array matching the number of checklist items (9 items)
const iconArray = [Zap, Target, Shield, Compass, Star, Rocket, Globe, ArrowRight, User, Zap]

const NotionInterface: React.FC = () => {
  // Debug logging to track component mounting
  useEffect(() => {
    console.log('🚀 NotionInterface component mounted at:', new Date().toISOString())
    console.log('🚀 Component instance ID:', Math.random().toString(36).substr(2, 9))
    return () => {
      console.log('🔄 NotionInterface component unmounting at:', new Date().toISOString())
    }
  }, [])

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => 
    checklistData.map((item, index) => ({
      ...item,
      isTyping: false,
      isTyped: false,
      isChecked: false,
      isExpanded: false,
      icon: iconArray[index] || Zap // Fallback to Zap if index out of bounds
    }))
  )
  
  const [typingProgress, setTypingProgress] = useState<Record<number, number>>({})
  const [openTabs, setOpenTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [dragItem, setDragItem] = useState<number | null>(null)
  const [dragOverItem, setDragOverItem] = useState<number | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
    const [hasAnimated, setHasAnimated] = useState(false)
  
  // Full screen view state
  const [fullScreenView, setFullScreenView] = useState<{
    isOpen: boolean
    type: 'architecture' | 'caseStudy' | 'demo'
    title: string
  }>({
    isOpen: false,
    type: 'architecture',
    title: ''
  })
  


  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  


  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle animation completion with useCallback to prevent unnecessary re-renders
  const handleAnimationComplete = useCallback((index: number) => {
    console.log(`Animation completed for item ${index}`)
    if (index === checklistItems.length - 1) {
      console.log('All animations completed, setting hasAnimated to true')
      setHasAnimated(true)
      console.log('hasAnimated set to true')
    }
  }, [checklistItems.length])

  // Start typing animation for each item - optimized with useCallback
  const startTyping = useCallback((index: number) => {
    if (index >= checklistItems.length) {
      setAnimationComplete(true)
      // Ensure all items are marked as typed when typing completes
      setChecklistItems(prev => prev.map(item => ({ ...item, isTyped: true })))
      console.log('All items marked as typed')
      return
    }

    const item = checklistItems[index]
    if (!item) {
      console.warn(`Item at index ${index} not found, skipping...`)
      startTyping(index + 1)
      return
    }

    // Mark item as typing
    setChecklistItems(prev => prev.map((item, i) => 
      i === index ? { ...item, isTyping: true } : item
    ))

    // Simulate typing animation
    const text = item.text
    let currentLength = 0
    const typingSpeed = prefersReducedMotion ? 5 : 15

    const typingInterval = setInterval(() => {
      currentLength += 1
      setTypingProgress(prev => ({ ...prev, [item.id]: currentLength }))

      if (currentLength >= text.length) {
        clearInterval(typingInterval)
        
        // Mark item as typed
        setChecklistItems(prev => prev.map((item, i) => 
          i === index ? { ...item, isTyping: false, isTyped: true } : item
        ))
        console.log(`Item ${index} marked as typed:`, item.text)

        // Start next item after a delay
        setTimeout(() => startTyping(index + 1), prefersReducedMotion ? 100 : 200)
      }
    }, typingSpeed)

    // Cleanup function to prevent memory leaks
    return () => clearInterval(typingInterval)
  }, [checklistItems, prefersReducedMotion])

  // Start typing animation after component mounts
  useEffect(() => {
    console.log('Starting typing animation...')
    startTyping(0)
  }, [startTyping])

  // Handle item click to open new window/tab
  const handleItemClick = (item: ChecklistItem) => {
    console.log('Item clicked:', item.text, 'isTyped:', item.isTyped)
    // Allow clicks even if not fully typed - just show the content as-is

    const newTab: Tab = {
      id: `tab-${item.id}`,
      title: item.details.title,
      content: (
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-6">
            <span className="text-6xl">{item.emoji}</span>
            <div>
              <h2 className="text-4xl font-bold text-white mb-3">{item.details.title}</h2>
              <p className="text-xl text-gray-400">{item.text}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Explanation</h3>
              <p className="text-lg text-gray-300 leading-relaxed">{item.details.explanation}</p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Key Outcomes</h3>
              <ul className="space-y-3">
                {item.details.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-center gap-4 text-lg text-gray-300">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    }

    // Add new tab if it doesn't exist
    if (!openTabs.find(tab => tab.id === newTab.id)) {
      setOpenTabs(prev => [...prev, newTab])
    }
    
    // Set as active tab
    setActiveTab(newTab.id)
  }

  // Close tab
  const closeTab = (tabId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTab === tabId) {
      setActiveTab(null)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, itemId: number) => {
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

  // Handle full screen view
  const handleFullScreenView = (type: 'architecture' | 'caseStudy' | 'demo', title: string) => {
    setFullScreenView({
      isOpen: true,
      type,
      title
    })
  }

  // Close full screen view
  const closeFullScreenView = () => {
    setFullScreenView({
      isOpen: false,
      type: 'architecture',
      title: ''
    })
  }

  // Handle project click to open new tab
  const handleProjectClick = (title: string) => {
    const newTab: Tab = {
      id: `project-${title.replace(/\s+/g, '-').toLowerCase()}`,
      title: title,
      content: (
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-6">
            <span className="text-6xl">🚀</span>
            <div>
              <h2 className="text-4xl font-bold text-white mb-3">{title}</h2>
              <p className="text-xl text-gray-400">Project Case Study</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {title === 'Agentic Claims PDF Processing Agent' && (
              <>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Summary</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    A no-code AI agent that parses complex claims PDFs into structured data and integrates with internal systems.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Impact</h3>
                  <p className="text-lg text-gray-300">60% faster claims processing</p>
                </div>
                <div>
                  <button
                    onClick={() => handleFullScreenView('architecture', title)}
                    className="px-4 py-2 text-sm text-white/80 border border-white/20 rounded-md hover:bg-white/5 hover:text-white/90 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a1a1a]"
                  >
                    See Architecture
                  </button>
                </div>
              </>
            )}

            {title === 'PDF-to-Frontend Code Generation' && (
              <>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Summary</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    An AI-powered workflow that converts static PDF designs into production-ready front-end code.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Impact</h3>
                  <p className="text-lg text-gray-300">70% faster build cycles</p>
                </div>
                <div>
                  <button
                    onClick={() => handleFullScreenView('caseStudy', title)}
                    className="px-4 py-2 text-sm text-white/80 border border-white/20 rounded-md hover:bg-white/5 hover:text-white/90 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a1a1a]"
                  >
                    See Case Study
                  </button>
                </div>
              </>
            )}

            {title === 'Semantic Benchmarking for AdTech' && (
              <>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Summary</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    A benchmarking feature enabling advertisers to A/B test creative messaging and compare against competitors.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Impact</h3>
                  <p className="text-lg text-gray-300">40% boost in feature adoption</p>
                </div>
                <div>
                  <button
                    onClick={() => handleFullScreenView('demo', title)}
                    className="px-4 py-2 text-sm text-white/80 border border-white/20 rounded-md hover:bg-white/5 hover:text-white/90 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a1a1a]"
                  >
                    See Demo
                  </button>
                </div>
              </>
            )}

            {title === 'Data & Vendor Management at Scale' && (
              <>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Summary</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Data infrastructure and tools to improve forecasting accuracy and vendor performance.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Impact</h3>
                  <p className="text-lg text-gray-300">25% more accurate forecasting, 20% lower procurement costs</p>
                </div>
                <div>
                  <button
                    onClick={() => handleFullScreenView('caseStudy', title)}
                    className="px-4 py-2 text-sm text-white/80 border border-white/20 rounded-md hover:bg-white/5 hover:text-white/90 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a1a1a]"
                  >
                    See Case Study
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )
    }

    // Add new tab if it doesn't exist
    if (!openTabs.find(tab => tab.id === newTab.id)) {
      setOpenTabs(prev => [...prev, newTab])
    }
    
    // Set as active tab
    setActiveTab(newTab.id)
  }





                       return (
       <div className="w-full max-w-[1140px] relative z-10 flex justify-end flex-shrink-0 ml-auto mr-4 overflow-hidden" style={{ minWidth: 0 }}>
                {/* Window Container with Embedded Look */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md border border-gray-600/60 rounded-3xl shadow-2xl p-3 relative flex-shrink-0 w-full max-w-[1140px] ring-1 ring-gray-500/20 overflow-hidden">
                 {/* Window Title Bar */}
         <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/95 to-gray-700/95 border-b border-gray-600/50 rounded-t-2xl px-6 py-4 mb-2 backdrop-blur-sm">
           {/* Window Controls */}
           <div className="flex items-center gap-3">
             <div className="w-3.5 h-3.5 rounded-full bg-red-500/90 hover:bg-red-400 transition-colors cursor-pointer"></div>
             <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/90 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
             <div className="w-3.5 h-3.5 rounded-full bg-green-500/90 hover:bg-green-400 transition-colors cursor-pointer"></div>
           </div>
           
           {/* Window Title */}
           <div className="flex items-center gap-3 text-gray-200 text-base font-semibold">
             <div className="w-4 h-4 bg-blue-500/80 rounded-md flex items-center justify-center">
               <span className="text-white text-xs">🧠</span>
             </div>
             <span className="tracking-wide">My Product Brain (The Harneet Method)</span>
           </div>
           
           {/* Window Actions */}
           <div className="flex items-center gap-3">
             <div className="w-4 h-4 bg-gray-500/60 rounded-md hover:bg-gray-400/80 transition-colors cursor-pointer"></div>
             <div className="w-4 h-4 bg-gray-500/60 rounded-md hover:bg-gray-400/80 transition-colors cursor-pointer"></div>
           </div>
         </div>

                                                                                                                                                                                                                                                                                               {/* Full Notion Interface */}
             <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl overflow-hidden h-[800px] w-full relative flex-shrink-0 ring-1 ring-gray-600/30">
                      <div className="flex h-full flex-shrink-0 min-w-0">
                                                                                                                                                                                                               {/* Left Sidebar */}
                <div className={`min-w-0 flex-shrink-0 bg-gradient-to-b from-[#1a1a1a] to-[#222] border-r border-[#444] transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'}`}>
              <div className="h-full overflow-y-auto p-4 space-y-6">
                                 {/* Workspace Header */}
                 <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                   <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-base shadow-lg">
                     HB
                   </div>
                   {!sidebarCollapsed && (
                     <div className="flex-1">
                       <div className="text-white font-semibold text-base">Harneet Bali</div>
                       <div className="text-blue-200 text-sm">Brainspace</div>
                     </div>
                   )}
                 </div>

                                                                   {/* Back Button */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setActiveTab(null)
                        setOpenTabs([])
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white group"
                    >
                      <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                      {!sidebarCollapsed && <span className="text-base">Back to Main</span>}
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
                      <FileText className="w-5 h-5" />
                      {!sidebarCollapsed && <span className="text-base">My Product Brain</span>}
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
                    <Settings className="w-5 h-5" />
                    {!sidebarCollapsed && <span className="text-base">Settings</span>}
                  </button>
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#333] transition-colors text-gray-300 hover:text-white">
                    <User className="w-5 h-5" />
                    {!sidebarCollapsed && <span className="text-base">Profile</span>}
                  </button>
                </div>
              </div>
            </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* Main Content Area */}
                  <div className="min-w-0 flex-1 flex flex-col h-full relative flex-shrink-0 overflow-hidden">
                                                               {/* Tabs */}
                <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border-b border-[#444] flex items-center flex-shrink-0 z-10 shadow-sm min-w-0 overflow-x-auto">
                  {/* Home tab - always present and can't be closed */}
                  <div
                    className={`px-6 py-3 cursor-pointer border-r border-[#444] transition-all duration-200 flex-shrink-0 ${
                      !activeTab
                        ? 'bg-gradient-to-r from-[#2a2a2a] to-[#333] text-white shadow-inner'
                        : 'bg-transparent text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                    }`}
                    onClick={() => setActiveTab(null)}
                  >
                    <span className="mr-2">🏠</span> My Product Brain
                  </div>
                 
                                  {/* Dynamic tabs from clicked items */}
                  {openTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`px-6 py-3 cursor-pointer border-r border-[#444] transition-all duration-200 flex-shrink-0 min-w-0 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#2a2a2a] to-[#333] text-white shadow-inner'
                          : 'bg-transparent text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="truncate max-w-[150px]">{tab.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.id);
                        }}
                        className="ml-3 text-gray-500 hover:text-red-400 transition-colors text-lg font-bold flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
               </div>

                                                                                                                                                                                                                                             {/* Content */}
                  <div className="min-w-0 flex-1 flex flex-col min-h-0 relative flex-shrink-0">
                                    {/* Always show the main My Product Brain content */}
                                        <div className="min-w-0 flex-1 overflow-y-auto flex-shrink-0 h-full max-h-[720px]">
                     <div className="p-8 lg:p-12">
                    {/* Page Header */}
                    <div className="space-y-8 mb-12">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🧠</span>
                        <h1 className="text-3xl font-bold text-white">
                          My Product Brain (The Harneet Method)
                        </h1>
                      </div>
                      <p className="text-lg text-gray-300 max-w-2xl">
                        A comprehensive framework for building successful products, from ideation to execution.
                      </p>
                    </div>

                                                                                   {/* Checklist */}
                      <div key="checklist-container" className="space-y-4">
                       {checklistItems.map((item, index) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e: React.DragEvent) => handleDragStart(e, item.id)}
                          onDragOver={(e: React.DragEvent) => handleDragOver(e, item.id)}
                          onDrop={(e: React.DragEvent) => handleDrop(e, item.id)}
                          onDragEnd={(e: React.DragEvent) => handleDragEnd()}
                          onClick={() => handleItemClick(item)}
                          className="cursor-pointer"
                        >
                          <motion.div
                            key={`motion-${item.id}`}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 1.2,
                              delay: index * 0.25,
                              ease: [0.22, 1, 0.36, 1]
                            }}
                            onAnimationComplete={() => handleAnimationComplete(index)}
                            whileHover={prefersReducedMotion ? {} : {
                              y: -2,
                              transition: { duration: 0.2, ease: "easeOut" }
                            }}
                            className={`bg-[#171717] border border-[#262626] rounded-[14px] p-[16px] transition-all duration-200 group will-change-transform ${
                              item.isTyped ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#1f1f1f] opacity-90'
                            }`}
                            data-item-id={item.id}
                            style={{
                              boxShadow: prefersReducedMotion ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                          >
                                                         {/* Colored Icon with micro-feedback and looped animations */}
                             <div className="flex items-center gap-4 min-w-0 flex-1">
                               <div className="flex items-center justify-center w-8 h-8 relative flex-shrink-0">
                                 {React.createElement(item.icon, { 
                                   className: "w-7 h-7 relative z-10",
                                   style: { 
                                     color: ['#fbbf24', '#c084fc', '#fde047', '#f59e0b', '#22c55e', '#f97316'][index % 6]
                                   }
                                 })}
                               </div>
                                                               <span className={`text-xl transition-colors duration-200 min-w-0 flex-1 ${
                                  item.isTyped 
                                    ? 'text-gray-200 group-hover:text-white' 
                                    : 'text-gray-400'
                                }`}>
                                  <span className="break-words">{item.text}</span>
                                </span>
                             </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tab content overlay - positioned absolutely over the main content */}
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

                                                               {/* Full Screen Overlay - Website Wide */}
          {fullScreenView.isOpen && createPortal(
            <div 
              className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={closeFullScreenView}
              style={{ 
                position: 'fixed', 
                zIndex: 9999,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh'
              }}
            >
              <div 
                className="bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '95vw',
                  maxHeight: '95vh',
                  width: '95vw',
                  height: '95vh'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#333]">
                  <h2 className="text-2xl font-semibold text-white">
                    {fullScreenView.type === 'architecture' && 'Architecture'}
                    {fullScreenView.type === 'caseStudy' && 'Case Study'}
                    {fullScreenView.type === 'demo' && 'Demo'}
                    : {fullScreenView.title}
                  </h2>
                  <button
                    onClick={closeFullScreenView}
                    className="text-gray-400 hover:text-white transition-colors text-2xl"
                    aria-label="Close full screen view"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto h-[calc(95vh-120px)]">
                  {fullScreenView.type === 'architecture' && (
                    <div className="space-y-6">
                      <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-8 text-center">
                        <div className="text-8xl mb-4">🏗️</div>
                        <h3 className="text-3xl font-bold text-white mb-4">System Architecture</h3>
                        <p className="text-xl text-gray-300 mb-6">
                          Interactive architecture diagram showing the complete system flow
                        </p>
                        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
                          <div className="text-6xl mb-4">📊</div>
                          <p className="text-lg text-gray-400">Architecture visualization coming soon...</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {fullScreenView.type === 'caseStudy' && (
                    <div className="space-y-8">
                      <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-8">
                        <h3 className="text-3xl font-bold text-white mb-6">Detailed Case Study</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4">Process</h4>
                            <p className="text-gray-300 leading-relaxed">
                              Comprehensive analysis of the development process, challenges faced, and solutions implemented.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4">Results</h4>
                            <p className="text-gray-300 leading-relaxed">
                              Detailed metrics, outcomes, and impact measurements from the project implementation.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-6">
                        <p className="text-center text-gray-400">Full case study content coming soon...</p>
                      </div>
                    </div>
                  )}

                  {fullScreenView.type === 'demo' && (
                    <div className="space-y-6">
                      <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-8 text-center">
                        <div className="text-8xl mb-4">🎥</div>
                        <h3 className="text-3xl font-bold text-white mb-4">Interactive Demo</h3>
                        <p className="text-xl text-gray-300 mb-6">
                          Live demonstration of the feature in action
                        </p>
                        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 aspect-video flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-4">▶️</div>
                            <p className="text-lg text-gray-400">Demo video coming soon...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}

      </div>
    )
  }

export default React.memo(NotionInterface)
