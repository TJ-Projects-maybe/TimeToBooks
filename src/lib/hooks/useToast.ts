"use client"

import { toast, ToasterToast } from 'sonner'

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
  promise?: Promise<any>
  onDismiss?: (toast: ToasterToast) => void
  onAutoClose?: (toast: ToasterToast) => void
}

/**
 * Show a success toast
 */
export const showSuccess = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
): string | undefined => {
  return toast.success(message, {
    duration: options?.duration || 4000,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  })
}

/**
 * Show an error toast
 */
export const showError = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
): string | undefined => {
  return toast.error(message, {
    duration: options?.duration || 6000,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  })
}

/**
 * Show a warning toast
 */
export const showWarning = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
): string | undefined => {
  return toast.warning(message, {
    duration: options?.duration || 5000,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  })
}

/**
 * Show an info toast
 */
export const showInfo = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
): string | undefined => {
  return toast.info(message, {
    duration: options?.duration || 4000,
    description: options?.description,
    action: options?.action,
    cancel: options?.cancel,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  })
}

/**
 * Show a toast with a promise
 */
export const showPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  },
  options?: ToastOptions
): Promise<T> => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    duration: options?.duration,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
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

  const promise = <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
    options?: ToastOptions
  ) => showPromise(promise, messages, options)

  return {
    success,
    error,
    warning,
    info,
    promise,
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
