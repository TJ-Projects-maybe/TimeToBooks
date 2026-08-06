import { describe, it, expect, beforeEach } from 'vitest'
import { cache, clearCache, makeCacheKey } from '../utils/cache'
import { AppError, handleError, ErrorCodes } from '../utils/errors'

describe('Cache', () => {
  beforeEach(() => {
    clearCache()
  })

  describe('get/set', () => {
    it('should set and get cached data', () => {
      cache.set('test:key', 'test value')
      const result = cache.get<string>('test:key')
      
      expect(result).toBe('test value')
    })

    it('should return null for non-existent key', () => {
      const result = cache.get<string>('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete cached data', () => {
      cache.set('test:key', 'test value')
      cache.delete('test:key')
      
      const result = cache.get<string>('test:key')
      expect(result).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear all cached data', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      
      clearCache()
      
      expect(cache.get<string>('key1')).toBeNull()
      expect(cache.get<string>('key2')).toBeNull()
    })
  })

  describe('has', () => {
    it('should return true for existing key', () => {
      cache.set('test:key', 'test value')
      expect(cache.has('test:key')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(cache.has('non-existent')).toBe(false)
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
})

describe('AppError', () => {
  it('should create an AppError with default values', () => {
    const error = new AppError('Test error')
    
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('UNKNOWN_ERROR')
    expect(error.statusCode).toBe(500)
    expect(error.name).toBe('AppError')
  })

  it('should create an AppError with custom values', () => {
    const originalError = new Error('Original error')
    const error = new AppError('Custom error', 'CUSTOM_ERROR', originalError, 400)
    
    expect(error.message).toBe('Custom error')
    expect(error.code).toBe('CUSTOM_ERROR')
    expect(error.statusCode).toBe(400)
    expect(error.originalError).toBe(originalError)
  })
})

describe('handleError', () => {
  it('should return AppError as-is', () => {
    const appError = new AppError('Test', 'TEST_ERROR')
    const result = handleError(appError)
    
    expect(result).toBe(appError)
  })

  it('should convert Error to AppError', () => {
    const error = new Error('Test error')
    const result = handleError(error)
    
    expect(result).toBeInstanceOf(AppError)
    expect(result.message).toBe('Test error')
    expect(result.code).toBe('UNKNOWN_ERROR')
  })

  it('should handle string errors', () => {
    const result = handleError('String error')
    
    expect(result).toBeInstanceOf(AppError)
    expect(result.message).toBe('String error')
  })
})
