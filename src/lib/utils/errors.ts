/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  public readonly code: string
  public readonly originalError?: Error
  public readonly statusCode: number

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    originalError?: Error,
    statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.originalError = originalError
    this.statusCode = statusCode

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

/**
 * Error codes for the application
 */
export const ErrorCodes = {
  // Authentication errors
  AUTH_NOT_AUTHENTICATED: 'AUTH_NOT_AUTHENTICATED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',

  // Database errors
  DB_NOT_FOUND: 'DB_NOT_FOUND',
  DB_DUPLICATE: 'DB_DUPLICATE',
  DB_CONSTRAINT: 'DB_CONSTRAINT',
  DB_CONNECTION: 'DB_CONNECTION',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Not found errors
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Permission errors
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UNAUTHORIZED: 'UNAUTHORIZED',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Unknown errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

/**
 * Type for error codes
 */
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

/**
 * Handle any error and convert it to an AppError
 */
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.name === 'AuthError') {
      return new AppError(
        error.message || 'Authentication failed',
        ErrorCodes.AUTH_NOT_AUTHENTICATED,
        error,
        401
      )
    }

    if (error.message.includes('not found') || error.message.includes('No rows')) {
      return new AppError(
        error.message || 'Resource not found',
        ErrorCodes.DB_NOT_FOUND,
        error,
        404
      )
    }

    if (error.message.includes('duplicate') || error.message.includes('Unique violation')) {
      return new AppError(
        error.message || 'Duplicate entry',
        ErrorCodes.DB_DUPLICATE,
        error,
        409
      )
    }

    if (error.message.includes('connection') || error.message.includes('network')) {
      return new AppError(
        error.message || 'Network error',
        ErrorCodes.NETWORK_ERROR,
        error,
        503
      )
    }

    return new AppError(
      error.message || 'An unknown error occurred',
      ErrorCodes.UNKNOWN_ERROR,
      error
    )
  }

  // Handle string errors
  if (typeof error === 'string') {
    return new AppError(error, ErrorCodes.UNKNOWN_ERROR)
  }

  return new AppError(
    'An unknown error occurred',
    ErrorCodes.UNKNOWN_ERROR
  )
}

/**
 * Create a not found error
 */
export const notFoundError = (resource: string, id?: string): AppError => {
  const message = id
    ? `${resource} with id '${id}' not found`
    : `${resource} not found`
  return new AppError(message, ErrorCodes.DB_NOT_FOUND as ErrorCode, undefined, 404)
}

/**
 * Create a validation error
 */
export const validationError = (message: string, details?: Record<string, string[]>): AppError => {
  const error = new AppError(
    message || 'Validation failed',
    ErrorCodes.VALIDATION_ERROR,
    undefined,
    400
  )
  // Attach validation details if provided
  if (details) {
    (error as any).validationDetails = details
  }
  return error
}

/**
 * Create an unauthorized error
 */
export const unauthorizedError = (message: string = 'Unauthorized'): AppError => {
  return new AppError(message, ErrorCodes.UNAUTHORIZED, undefined, 401)
}

/**
 * Create a permission denied error
 */
export const permissionDeniedError = (message: string = 'Permission denied'): AppError => {
  return new AppError(message, ErrorCodes.PERMISSION_DENIED, undefined, 403)
}
