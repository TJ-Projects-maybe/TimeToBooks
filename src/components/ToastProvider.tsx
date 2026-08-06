"use client"

import { Toaster } from 'sonner'

export const ToastProvider = () => (
  <Toaster
    richColors
    theme="system"
    position="top-right"
    closeButton
    toastOptions={{
      classNames: {
        toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-gray-900',
        success: 'group-[.toast]:bg-green-50 group-[.toast]:dark:bg-green-900/20',
        error: 'group-[.toast]:bg-red-50 group-[.toast]:dark:bg-red-900/20',
        warning: 'group-[.toast]:bg-amber-50 group-[.toast]:dark:bg-amber-900/20',
        info: 'group-[.toast]:bg-blue-50 group-[.toast]:dark:bg-blue-900/20',
      },
    }}
  />
)
