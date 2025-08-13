import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
  },
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))