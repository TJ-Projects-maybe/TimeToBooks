import { describe, it, expect, beforeEach } from 'vitest'
import {
  cache,
  getCached,
  setCached,
  deleteCached,
  clearCache,
  makeCacheKey,
  withCache
} from '../cache'

describe('Cache', () => {
  beforeEach(() => {
    clearCache()
  })

  describe('get/set', () => {
    it('should set and get cached data', () => {
      setCached('test:key', 'test value')
      const result = getCached<string>('test:key')
      
      expect(result).toBe('test value')
    })

    it('should return null for non-existent key', () => {
      const result = getCached<string>('non-existent')
      expect(result).toBeNull()
    })

    it('should return null for expired cache', () => {
      setCached('test:key', 'test value', 1) // 1ms TTL
      
      // Wait for expiration
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = getCached<string>('test:key')
          expect(result).toBeNull()
          resolve(null)
        }, 10)
      })
    })

    it('should override existing cache', () => {
      setCached('test:key', 'value1')
      setCached('test:key', 'value2')
      
      const result = getCached<string>('test:key')
      expect(result).toBe('value2')
    })
  })

  describe('delete', () => {
    it('should delete cached data', () => {
      setCached('test:key', 'test value')
      deleteCached('test:key')
      
      const result = getCached<string>('test:key')
      expect(result).toBeNull()
    })

    it('should not throw for non-existent key', () => {
      expect(() => deleteCached('non-existent')).not.toThrow()
    })
  })

  describe('clear', () => {
    it('should clear all cached data', () => {
      setCached('key1', 'value1')
      setCached('key2', 'value2')
      
      clearCache()
      
      expect(getCached<string>('key1')).toBeNull()
      expect(getCached<string>('key2')).toBeNull()
    })
  })

  describe('has', () => {
    it('should return true for existing key', () => {
      setCached('test:key', 'test value')
      expect(cache.has('test:key')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(cache.has('non-existent')).toBe(false)
    })

    it('should return false for expired key', () => {
      setCached('test:key', 'test value', 1) // 1ms TTL
      
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(cache.has('test:key')).toBe(false)
          resolve(null)
        }, 10)
      })
    })
  })

  describe('getStats', () => {
    it('should return cache statistics', () => {
      setCached('key1', 'value1')
      setCached('key2', 'value2')
      
      const stats = cache.getStats()
      
      expect(stats.size).toBe(2)
      expect(stats.keys).toContain('key1')
      expect(stats.keys).toContain('key2')
    })
  })
})

describe('makeCacheKey', () => {
  it('should create cache key from parts', () => {
    const key = makeCacheKey('projects', 'user123')
    expect(key).toBe('projects:user123')
  })

  it('should handle multiple parts', () => {
    const key = makeCacheKey('sessions', 'project', '123', 'user', '456')
    expect(key).toBe('sessions:project:123:user:456')
  })

  it('should convert all parts to strings', () => {
    const key = makeCacheKey('test', 123, true, false)
    expect(key).toBe('test:123:true:false')
  })
})

describe('withCache', () => {
  beforeEach(() => {
    clearCache()
  })

  it('should cache function results', () => {
    let callCount = 0
    const fn = () => {
      callCount++
      return 'result'
    }
    
    const cachedFn = withCache(fn)
    
    const result1 = cachedFn()
    const result2 = cachedFn()
    
    expect(result1).toBe('result')
    expect(result2).toBe('result')
    expect(callCount).toBe(1) // Function should only be called once
  })

  it('should cache with different arguments separately', () => {
    let callCount = 0
    const fn = (a: number) => {
      callCount++
      return a * 2
    }
    
    const cachedFn = withCache(fn)
    
    const result1 = cachedFn(1)
    const result2 = cachedFn(2)
    const result3 = cachedFn(1)
    
    expect(result1).toBe(2)
    expect(result2).toBe(4)
    expect(result3).toBe(2)
    expect(callCount).toBe(2) // Function should be called twice (for 1 and 2)
  })

  it('should cache async function results', async () => {
    let callCount = 0
    const fn = async () => {
      callCount++
      return Promise.resolve('async result')
    }
    
    const cachedFn = withCache(fn)
    
    const result1 = await cachedFn()
    const result2 = await cachedFn()
    
    expect(result1).toBe('async result')
    expect(result2).toBe('async result')
    expect(callCount).toBe(1)
  })

  it('should respect custom TTL', () => {
    let callCount = 0
    const fn = () => {
      callCount++
      return 'result'
    }
    
    const cachedFn = withCache(fn, 1) // 1ms TTL
    
    const result1 = cachedFn()
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const result2 = cachedFn()
        expect(result1).toBe('result')
        expect(result2).toBe('result')
        expect(callCount).toBe(2) // Function should be called twice due to expiration
        resolve(null)
      }, 10)
    })
  })
})
