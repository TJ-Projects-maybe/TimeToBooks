/**
 * Decorator to ensure a function is only called client-side
 * Throws an error if called server-side
 */
export const clientOnly = <T extends (...args: any[]) => any>(fn: T): T => {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called client-side')
    }
    return fn(...args)
  }) as T
}

/**
 * Utility to check if we're in a client environment
 */
export const isClient = typeof window !== 'undefined'

/**
 * Utility to check if we're in a server environment
 */
export const isServer = typeof window === 'undefined'
