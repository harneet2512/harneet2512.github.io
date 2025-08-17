"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'

// Configuration - easily tweakable
const CONFIG = {
  colors: {
    circle: '#FFFFFF',
    shadow: 'rgba(255, 255, 255, 0.15)',
    iBeam: '#7C3AED'
  },
  sizes: {
    circle: 12, // diameter in px
    iBeamWidth: 2, // width in px
    shadowOffset: 4 // shadow blur offset
  }
} as const

interface CustomCursorProps {
  accentColor?: string
}

const CustomCursor: React.FC<CustomCursorProps> = ({ 
  accentColor = CONFIG.colors.iBeam
}) => {
  const [isVisible, setIsVisible] = useState(true) // Start visible
  const [cursorVariant, setCursorVariant] = useState<'circle' | 'iBeam'>('circle')
  const [iBeamHeight, setIBeamHeight] = useState(16)
  
  // Refs for performance
  const cursorRef = useRef<HTMLDivElement>(null)
  const lastVariantRef = useRef<'circle' | 'iBeam'>('circle')
  const lastIBeamHeightRef = useRef(16)

  // SIMPLIFIED: Check if element OR ANY PARENT is interactive (should show white circle)
  const hasInteractiveParent = useCallback((element: Element | null): boolean => {
    if (!element) return false
    
    let currentElement: Element | null = element
    
    // Walk up the entire DOM tree to check for ANY interactive parent
    while (currentElement && currentElement !== document.body) {
      const tagName = currentElement.tagName.toLowerCase()
      
      // Fast path for common interactive elements
      if (['a', 'button', 'input', 'textarea', 'select', 'option', 'img', 'svg', 'canvas'].includes(tagName)) {
        return true
      }
      
      // Check for interactive attributes
      const role = currentElement.getAttribute('role')
      if (role && ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch'].includes(role)) {
        return true
      }
      
      // Check other interactive properties
      if (currentElement.getAttribute('contenteditable') === 'true') return true
      
      const tabIndex = currentElement.getAttribute('tabindex')
      if (tabIndex !== null && tabIndex !== undefined && parseInt(tabIndex) >= 0) return true
      
      if (currentElement.hasAttribute && currentElement.hasAttribute('onclick') || (currentElement as any).onclick) return true
      
      // Check for data attributes that indicate interactivity
      if (currentElement.hasAttribute('data-interactive') || currentElement.hasAttribute('data-clickable')) return true
      
      // Check computed cursor style
      const computedStyle = window.getComputedStyle(currentElement)
      const cursorStyle = computedStyle.cursor
      
      if (['pointer', 'grab', 'move', 'zoom-in', 'zoom-out', 'crosshair', 'help'].includes(cursorStyle)) {
        return true
      }
      
      // Check for common UI component classes (but be less aggressive)
      const className = currentElement.className || ''
      if (typeof className === 'string' && (
        className.includes('button') || 
        className.includes('link') || 
        className.includes('clickable') || 
        className.includes('interactive')
      )) {
        return true
      }
      
      currentElement = currentElement.parentElement
    }
    
    return false
  }, [])

  // LESS RESTRICTIVE: Show I-beam for more text elements
  const isSelectableText = useCallback((element: Element | null): boolean => {
    if (!element) return false
    
    // If element OR ANY parent is interactive, never show I-beam
    if (hasInteractiveParent(element)) return false
    
    const tagName = element.tagName.toLowerCase()
    
    // Allow more text elements for I-beam
    if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'li', 'td', 'th', 'article', 'section', 'main'].includes(tagName)) {
      // Check if it contains meaningful text (not just whitespace)
      const textContent = element.textContent
      const meaningfulText = textContent ? textContent.trim().replace(/\s+/g, ' ').length : 0
      return meaningfulText > 3 // Lower threshold for more I-beam usage
    }
    
    return false
  }, [hasInteractiveParent])

  // Update cursor position and variant - SIMPLIFIED LOGIC
  const updateCursor = useCallback((e: MouseEvent) => {
    if (!cursorRef.current) return
    
    // DIRECT 1:1 tracking - no spring, no easing, no delay
    const offsetX = cursorVariant === 'circle' ? CONFIG.sizes.circle / 2 : CONFIG.sizes.iBeamWidth / 2
    const offsetY = cursorVariant === 'circle' ? CONFIG.sizes.circle / 2 : iBeamHeight / 2
    
    // Use transform3d for hardware acceleration and immediate positioning
    cursorRef.current.style.transform = `translate3d(${e.clientX - offsetX}px, ${e.clientY - offsetY}px, 0)`
    
    // Get element at cursor position
    const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY)
    
    if (!elementAtPoint) return
    
    // Check if this is selectable text
    let shouldShowIBeam = false
    let fontSize = 16
    
    if (isSelectableText(elementAtPoint)) {
      shouldShowIBeam = true
      // Get font size for I-beam height
      const computedStyle = window.getComputedStyle(elementAtPoint)
      const parsedFontSize = parseFloat(computedStyle.fontSize)
      fontSize = !isNaN(parsedFontSize) ? parsedFontSize : 16
    }
    
    // Only update state if values actually changed
    const newVariant = shouldShowIBeam ? 'iBeam' : 'circle'
    const newHeight = Math.round(fontSize * 1.2) // Slightly taller than font size
    
    if (newVariant !== lastVariantRef.current) {
      lastVariantRef.current = newVariant
      setCursorVariant(newVariant)
    }
    
    if (shouldShowIBeam && newHeight !== lastIBeamHeightRef.current) {
      lastIBeamHeightRef.current = newHeight
      setIBeamHeight(newHeight)
    }
  }, [cursorVariant, iBeamHeight, isSelectableText])

  // Show/hide cursor handlers - MORE ROBUST
  const handleMouseEnter = useCallback(() => setIsVisible(true), [])
  const handleMouseLeave = useCallback(() => setIsVisible(false), [])
  const handleMouseMove = useCallback(() => setIsVisible(true), []) // Keep visible on any mouse movement

  // Global styles and event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Add global cursor styles
    const styleId = 'custom-cursor-styles'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      styleElement.textContent = `
        body, body * {
          cursor: none !important;
        }
        
        /* Ensure cursor is hidden on all elements */
        *, *::before, *::after {
          cursor: none !important;
        }
        
        /* Hide cursor on scrollbars */
        ::-webkit-scrollbar {
          cursor: none !important;
        }
        
        /* Hide cursor on scroll elements */
        html, body {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
      `
      document.head.appendChild(styleElement)
    }

    // Event listeners with passive flag for better performance
    const eventOptions: AddEventListenerOptions = { passive: true }
    document.addEventListener('mousemove', updateCursor, eventOptions)
    document.addEventListener('mousemove', handleMouseMove, eventOptions) // Keep visible on movement
    document.addEventListener('mouseenter', handleMouseEnter, eventOptions)
    document.addEventListener('mouseleave', handleMouseLeave, eventOptions)
    
    // Handle visibility on window focus/blur
    const handleWindowFocus = () => setIsVisible(true)
    const handleWindowBlur = () => setIsVisible(false)
    window.addEventListener('focus', handleWindowFocus)
    window.addEventListener('blur', handleWindowBlur)

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', updateCursor)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('focus', handleWindowFocus)
      window.removeEventListener('blur', handleWindowBlur)
      
      // Remove style element if it exists
      const existingStyle = document.getElementById(styleId)
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle)
      }
    }
  }, [updateCursor, handleMouseEnter, handleMouseLeave, handleMouseMove])

  // Don't render if cursor is not visible or in SSR
  if (!isVisible || typeof window === 'undefined') return null

  return (
    <>
      {/* Circle cursor (default) */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[99999]"
        style={{
          display: cursorVariant === 'circle' ? 'block' : 'none',
          transform: 'translate3d(0, 0, 0)', // Initial position, will be updated by JS
          willChange: 'transform'
        }}
      >
        {/* Main circle */}
        <div 
          className="rounded-full relative"
          style={{
            width: CONFIG.sizes.circle,
            height: CONFIG.sizes.circle,
            backgroundColor: CONFIG.colors.circle,
            transform: 'translateZ(0)', // Force hardware acceleration
            willChange: 'transform'
          }}
        >
          {/* Subtle shadow/glow */}
          <div 
            className="absolute inset-0 rounded-full blur-sm pointer-events-none"
            style={{
              width: CONFIG.sizes.circle + CONFIG.sizes.shadowOffset,
              height: CONFIG.sizes.circle + CONFIG.sizes.shadowOffset,
              backgroundColor: CONFIG.colors.shadow,
              transform: 'translate(-2px, -2px)',
              willChange: 'transform'
            }}
          />
        </div>
      </div>

      {/* I-beam cursor (for text) */}
      <div
        className="fixed pointer-events-none z-[99999]"
        style={{
          display: cursorVariant === 'iBeam' ? 'block' : 'none',
          transform: 'translate3d(0, 0, 0)', // Initial position, will be updated by JS
          willChange: 'transform'
        }}
      >
        {/* I-beam */}
        <div 
          className="rounded-full relative mx-auto"
          style={{
            width: CONFIG.sizes.iBeamWidth,
            height: iBeamHeight,
            backgroundColor: accentColor,
            transform: 'translateZ(0)', // Force hardware acceleration
            willChange: 'transform'
          }}
        >
          {/* Subtle glow for I-beam */}
          <div 
            className="absolute inset-0 rounded-full blur-sm opacity-60 pointer-events-none"
            style={{
              width: CONFIG.sizes.iBeamWidth + 2,
              height: iBeamHeight,
              backgroundColor: accentColor,
              transform: 'translate(-1px, 0)',
              willChange: 'transform'
            }}
          />
        </div>
      </div>
    </>
  )
}

export default CustomCursor