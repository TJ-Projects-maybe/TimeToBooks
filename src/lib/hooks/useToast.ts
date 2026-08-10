"use client"

import { toast } from 'sonner'

/**
 * Toast types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default'

/**
 * Toast options
 */
export interface ToastOptions {
  duration?: number
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  cancel?: {
    label: string
    onClick: () => void
  }
}

/**
 * Show a success toast
 */
export const showSuccess = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
): void => {
  toast.success(message, {
    duration: options?.duration,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
  })
}

/**
 * Show an error toast
 */
export const showError = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
): void => {
  toast.error(message, {
    duration: options?.duration,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
  })
}

/**
 * Show a warning toast
 */
export const showWarning = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
): void => {
  toast.warning(message, {
    duration: options?.duration,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
  })
}

/**
 * Show an info toast
 */
export const showInfo = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
): void => {
  toast.info(message, {
    duration: options?.duration,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
  })
}

/**
 * Custom hook for toast notifications
 */
export const useToast = () => {
  const success = (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showSuccess(message, options)

  const error = (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showError(message, options)

  const warning = (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showWarning(message, options)

  const info = (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showInfo(message, options)

  return {
    success,
    error,
    warning,
    info,
    // Direct access to toast functions
    toast: {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
      message: toast.message,
      promise: toast.promise,
      dismiss: toast.dismiss,
      loading: toast.loading,
    },
  }
}

export default useToast
