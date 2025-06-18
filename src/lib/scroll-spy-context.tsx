'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

interface ScrollSpyContextType {
  activeSection: string | null
  registerSection: (id: string, element: HTMLElement) => void
  unregisterSection: (id: string) => void
  scrollToSection: (id: string) => void
}

const ScrollSpyContext = createContext<ScrollSpyContextType | undefined>(undefined)

export function useScrollSpy() {
  const context = useContext(ScrollSpyContext)
  if (!context) {
    throw new Error('useScrollSpy must be used within a ScrollSpyProvider')
  }
  return context
}

interface ScrollSpyProviderProps {
  children: React.ReactNode
  rootMargin?: string
  threshold?: number
}

export function ScrollSpyProvider({ 
  children, 
  rootMargin = '-80px 0px -80px 0px',
  threshold = 0.1 
}: ScrollSpyProviderProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isScrollingRef = useRef<boolean>(false)
  const scrollTargetRef = useRef<string | null>(null)

  // Initialize IntersectionObserver
  useEffect(() => {
    const updateActiveSection = (entries: IntersectionObserverEntry[]) => {
      const processEntries = () => {
        // During programmatic scrolling, prioritize the scroll target
        if (isScrollingRef.current && scrollTargetRef.current) {
          const targetEntry = entries.find(entry => 
            entry.target.getAttribute('data-scroll-spy-id') === scrollTargetRef.current
          )
          
          // If target is intersecting, use it; otherwise wait for it
          if (targetEntry && targetEntry.isIntersecting) {
            setActiveSection(scrollTargetRef.current)
            scrollTargetRef.current = null
            isScrollingRef.current = false
            return
          }
          
          // If target isn't intersecting yet, don't update active section
          if (targetEntry) {
            return
          }
        }

        // Normal scroll spy logic for natural scrolling
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries[0]
          const sectionId = topEntry.target.getAttribute('data-scroll-spy-id')
          if (sectionId) {
            setActiveSection(sectionId)
          }
        } else {
          // If no sections are visible, keep the last active one
          // or find the closest one above the viewport
          const allEntries = entries.filter(entry => entry.target.getAttribute('data-scroll-spy-id'))
          if (allEntries.length > 0) {
            // Find the section that's closest to the top but above the viewport
            const aboveViewport = allEntries
              .filter(entry => entry.boundingClientRect.bottom < 0)
              .sort((a, b) => b.boundingClientRect.bottom - a.boundingClientRect.bottom)
            
            if (aboveViewport.length > 0) {
              const closestAbove = aboveViewport[0]
              const sectionId = closestAbove.target.getAttribute('data-scroll-spy-id')
              if (sectionId) {
                setActiveSection(sectionId)
              }
            }
          }
        }
        
        if (!isScrollingRef.current) {
          scrollTargetRef.current = null
        }
      }

      // Only debounce during programmatic scrolling to prevent flashing
      if (isScrollingRef.current) {
        // Clear any existing timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(processEntries, 200)
      } else {
        // Process immediately during natural scrolling for responsive feedback
        processEntries()
      }
    }

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin,
      threshold
    })

    observerRef.current = observer
    
    return () => {
      observer.disconnect()
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [rootMargin, threshold])

  const registerSection = useCallback((id: string, element: HTMLElement) => {
    sectionsRef.current.set(id, element)
    element.setAttribute('data-scroll-spy-id', id)
    
    if (observerRef.current) {
      observerRef.current.observe(element)
    }
  }, [])

  const unregisterSection = useCallback((id: string) => {
    const element = sectionsRef.current.get(id)
    if (element && observerRef.current) {
      observerRef.current.unobserve(element)
      element.removeAttribute('data-scroll-spy-id')
    }
    sectionsRef.current.delete(id)
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const element = sectionsRef.current.get(id)
    if (element) {
      isScrollingRef.current = true
      scrollTargetRef.current = id
      setActiveSection(id) // Set immediately for responsive UI
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false
        scrollTargetRef.current = null
      }, 1500)
    }
  }, [])

  const value: ScrollSpyContextType = {
    activeSection,
    registerSection,
    unregisterSection,
    scrollToSection
  }

  return (
    <ScrollSpyContext.Provider value={value}>
      {children}
    </ScrollSpyContext.Provider>
  )
} 