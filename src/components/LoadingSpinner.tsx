"use client"

import { FiLoader2 } from 'react-icons/fi'

/**
 * LoadingSpinner component props
 */
export interface LoadingSpinnerProps {
  /** Size of the spinner (default: 'md') */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Color of the spinner (default: 'blue') */
  color?: 'blue' | 'gray' | 'white' | 'green' | 'red' | 'purple'
  /** Message to display below the spinner */
  message?: string
  /** Whether to show the spinner (default: true) */
  show?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Size configurations for the spinner
 */
const sizeConfig = {
  sm: {
    spinner: 'h-4 w-4',
    border: 'border-2',
  },
  md: {
    spinner: 'h-8 w-8',
    border: 'border-4',
  },
  lg: {
    spinner: 'h-12 w-12',
    border: 'border-6',
  },
  xl: {
    spinner: 'h-16 w-16',
    border: 'border-8',
  },
}

/**
 * Color configurations for the spinner
 */
const colorConfig = {
  blue: {
    border: 'border-blue-600',
    transparent: 'border-transparent',
    icon: 'text-blue-600',
  },
  gray: {
    border: 'border-gray-600',
    transparent: 'border-transparent',
    icon: 'text-gray-600',
  },
  white: {
    border: 'border-white',
    transparent: 'border-transparent',
    icon: 'text-white',
  },
  green: {
    border: 'border-green-600',
    transparent: 'border-transparent',
    icon: 'text-green-600',
  },
  red: {
    border: 'border-red-600',
    transparent: 'border-transparent',
    icon: 'text-red-600',
  },
  purple: {
    border: 'border-purple-600',
    transparent: 'border-transparent',
    icon: 'text-purple-600',
  },
}

/**
 * LoadingSpinner component
 * Displays a spinning animation with an optional message
 */
export const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  message = 'Chargement...',
  show = true,
  className = '',
}: LoadingSpinnerProps) => {
  if (!show) return null

  const config = sizeConfig[size]
  const colors = colorConfig[color]

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Spinner with icon */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinner ring */}
        <div
          className={`
            absolute rounded-full border-solid ${colors.border} ${config.border}
            animate-spin ${config.spinner}
          `}
          style={{ borderRightColor: 'transparent' }}
        />
        
        {/* Inner spinner ring (optional) */}
        <div
          className={`
            absolute rounded-full border-solid ${colors.transparent} ${config.border}
            ${config.spinner} border-r-${colors.border.replace('border-', '')}
          `}
          style={{ borderLeftColor: 'transparent', borderBottomColor: 'transparent' }}
        />
        
        {/* Icon in the center */}
        <FiLoader2
          className={`absolute animate-spin ${colors.icon} ${config.spinner}`}
          aria-hidden="true"
        />
      </div>
      
      {/* Message */}
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * FullPageLoadingSpinner component
 * Displays a loading spinner that covers the entire page
 */
export const FullPageLoadingSpinner = ({
  message = 'Chargement...',
  color = 'blue',
}: Omit<LoadingSpinnerProps, 'size' | 'show' | 'className'>) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <LoadingSpinner
        size="lg"
        color={color}
        message={message}
        show={true}
      />
    </div>
  )
}

/**
 * InlineLoadingSpinner component
 * Displays a small loading spinner inline with text
 */
export const InlineLoadingSpinner = ({
  message = 'Chargement...',
  size = 'sm',
  color = 'blue',
  className = '',
}: Omit<LoadingSpinnerProps, 'show'>) => {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LoadingSpinner size={size} color={color} message="" show={true} />
      <span className="text-sm">{message}</span>
    </span>
  )
}

export default LoadingSpinner
