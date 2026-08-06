"use client"

import { FiArrowUp } from 'react-icons/fi'
import { useEffect, useState } from 'react'

/**
 * SkipLink component for accessibility
 * Allows keyboard users to skip to main content
 */
export const SkipLink = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show skip link on tab focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsVisible(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <a
      href="#main-content"
      className={`
        fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg
        transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isVisible ? 'opacity-100' : 'opacity-0 -translate-y-4'}
      `}
      onClick={() => setIsVisible(false)}
      aria-label="Aller au contenu principal"
    >
      <FiArrowUp className="inline mr-2" />
      Aller au contenu
    </a>
  )
}

export default SkipLink
