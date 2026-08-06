import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach, vi } from 'vitest'

// Mock window for client-side tests
global.window = {
  ...global.window,
  location: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
} as any

// Mock localStorage
global.localStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => global.localStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    global.localStorage.store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete global.localStorage.store[key]
  }),
  clear: vi.fn(() => {
    global.localStorage.store = {}
  }),
  length: 0,
  key: vi.fn((index: number) => Object.keys(global.localStorage.store)[index] || null),
} as any

// Mock sessionStorage
global.sessionStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => global.sessionStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    global.sessionStorage.store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete global.sessionStorage.store[key]
  }),
  clear: vi.fn(() => {
    global.sessionStorage.store = {}
  }),
  length: 0,
  key: vi.fn((index: number) => Object.keys(global.sessionStorage.store)[index] || null),
} as any

// Mock matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})

// Clean up after all tests
afterAll(() => {
  vi.restoreAllMocks()
})
