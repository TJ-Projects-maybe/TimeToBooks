/**
 * Simple in-memory cache for client-side data
 * Uses a Map to store cached data with TTL (Time To Live)
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private store = new Map<string, CacheEntry<any>>()
  private defaultTTL: number

  constructor(defaultTTL: number = 30000) {
    this.defaultTTL = defaultTTL
  }

  /**
   * Get cached data
   * @param key Cache key
   * @param defaultTTL Override default TTL for this get operation
   * @returns Cached data or null if not found or expired
   */
  get<T>(key: string, defaultTTL?: number): T | null {
    const entry = this.store.get(key)
    
    if (!entry) {
      return null
    }

    const ttl = defaultTTL ?? entry.ttl
    const now = Date.now()
    
    if (now - entry.timestamp > ttl) {
      this.store.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set cached data
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds (defaults to instance defaultTTL)
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL
    })
  }

  /**
   * Delete cached data
   * @param key Cache key
   */
  delete(key: string): void {
    this.store.delete(key)
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Check if cache has a key
   * @param key Cache key
   * @returns true if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.store.get(key)
    if (!entry) return false
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key)
      return false
    }
    
    return true
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys())
    }
  }
}

// Create a singleton cache instance
export const cache = new Cache()

/**
 * Get cached data with a specific TTL
 * @param key Cache key
 * @param ttl Time to live in milliseconds
 * @returns Cached data or null
 */
export const getCached = <T>(key: string, ttl?: number): T | null => {
  return cache.get<T>(key, ttl)
}

/**
 * Set cached data with a specific TTL
 * @param key Cache key
 * @param data Data to cache
 * @param ttl Time to live in milliseconds
 */
export const setCached = <T>(key: string, data: T, ttl?: number): void => {
  cache.set(key, data, ttl)
}

/**
 * Delete cached data
 * @param key Cache key
 */
export const deleteCached = (key: string): void => {
  cache.delete(key)
}

/**
 * Clear all cached data
 */
export const clearCache = (): void => {
  cache.clear()
}

/**
 * Create a cache key from multiple parts
 * @param parts Parts to combine into a cache key
 * @returns Combined cache key
 */
export const makeCacheKey = (...parts: (string | number | boolean)[]): string => {
  return parts.map(part => String(part)).join(':')
}

/**
 * Cache a function call
 * @param fn Function to cache
 * @param ttl Time to live in milliseconds
 * @returns Memoized function with caching
 */
export const withCache = <T extends (...args: any[]) => any>(
  fn: T,
  ttl?: number
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = makeCacheKey(fn.name, ...args)
    const cached = getCached<ReturnType<T>>(key)
    
    if (cached !== null) {
      return cached
    }

    const result = fn(...args)
    
    // Only cache if result is a Promise
    if (result instanceof Promise) {
      return result.then(data => {
        setCached(key, data, ttl)
        return data
      }) as ReturnType<T>
    }

    setCached(key, result, ttl)
    return result
  }
}
