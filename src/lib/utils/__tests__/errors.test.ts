import { describe, it, expect } from 'vitest'
import {
  AppError,
  handleError,
  notFoundError,
  validationError,
  unauthorizedError,
  permissionDeniedError,
  ErrorCodes
} from '../errors'

describe('AppError', () => {
  it('should create an AppError with default values', () => {
    const error = new AppError('Test error')
    
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('UNKNOWN_ERROR')
    expect(error.statusCode).toBe(500)
    expect(error.name).toBe('AppError')
    expect(error.originalError).toBeUndefined()
  })

  it('should create an AppError with custom values', () => {
    const originalError = new Error('Original error')
    const error = new AppError(
      'Custom error',
      'CUSTOM_ERROR',
      originalError,
      400
    )
    
    expect(error.message).toBe('Custom error')
    expect(error.code).toBe('CUSTOM_ERROR')
    expect(error.statusCode).toBe(400)
    expect(error.originalError).toBe(originalError)
  })

  it('should maintain stack trace', () => {
    const error = new AppError('Test error')
    expect(error.stack).toBeDefined()
    expect(error.stack?.includes('AppError')).toBe(true)
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
    expect(result.originalError).toBe(error)
  })

  it('should handle AuthError', () => {
    const error = new Error('Authentication failed')
    error.name = 'AuthError'
    const result = handleError(error)
    
    expect(result.code).toBe(ErrorCodes.AUTH_NOT_AUTHENTICATED)
    expect(result.statusCode).toBe(401)
  })

  it('should handle not found errors', () => {
    const error = new Error('not found')
    const result = handleError(error)
    
    expect(result.code).toBe(ErrorCodes.DB_NOT_FOUND)
    expect(result.statusCode).toBe(404)
  })

  it('should handle duplicate errors', () => {
    const error = new Error('duplicate key value violates unique constraint')
    const result = handleError(error)
    
    expect(result.code).toBe(ErrorCodes.DB_DUPLICATE)
    expect(result.statusCode).toBe(409)
  })

  it('should handle network errors', () => {
    const error = new Error('connection refused')
    const result = handleError(error)
    
    expect(result.code).toBe(ErrorCodes.NETWORK_ERROR)
    expect(result.statusCode).toBe(503)
  })

  it('should handle string errors', () => {
    const result = handleError('String error')
    
    expect(result).toBeInstanceOf(AppError)
    expect(result.message).toBe('String error')
    expect(result.code).toBe('UNKNOWN_ERROR')
  })

  it('should handle unknown error types', () => {
    const result = handleError(null)
    
    expect(result).toBeInstanceOf(AppError)
    expect(result.message).toBe('An unknown error occurred')
    expect(result.code).toBe('UNKNOWN_ERROR')
  })
})

describe('notFoundError', () => {
  it('should create a not found error with resource name', () => {
    const error = notFoundError('Project')
    
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('Project not found')
    expect(error.code).toBe(ErrorCodes.DB_NOT_FOUND)
    expect(error.statusCode).toBe(404)
  })

  it('should create a not found error with resource name and id', () => {
    const error = notFoundError('Project', '123')
    
    expect(error.message).toBe("Project with id '123' not found")
    expect(error.code).toBe(ErrorCodes.DB_NOT_FOUND)
    expect(error.statusCode).toBe(404)
  })
})

describe('validationError', () => {
  it('should create a validation error', () => {
    const error = validationError('Invalid input')
    
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('Invalid input')
    expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR)
    expect(error.statusCode).toBe(400)
  })

  it('should attach validation details', () => {
    const details = { email: ['Invalid email format'] }
    const error = validationError('Validation failed', details)
    
    expect((error as any).validationDetails).toEqual(details)
  })
})

describe('unauthorizedError', () => {
  it('should create an unauthorized error', () => {
    const error = unauthorizedError()
    
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('Unauthorized')
    expect(error.code).toBe(ErrorCodes.UNAUTHORIZED)
    expect(error.statusCode).toBe(401)
  })

  it('should accept custom message', () => {
    const error = unauthorizedError('Please log in')
    
    expect(error.message).toBe('Please log in')
  })
})

describe('permissionDeniedError', () => {
  it('should create a permission denied error', () => {
    const error = permissionDeniedError()
    
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('Permission denied')
    expect(error.code).toBe(ErrorCodes.PERMISSION_DENIED)
    expect(error.statusCode).toBe(403)
  })

  it('should accept custom message', () => {
    const error = permissionDeniedError('You do not have access')
    
    expect(error.message).toBe('You do not have access')
  })
})
