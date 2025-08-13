/**
 * Utility functions for CalmMyself application
 */

/**
 * Combines class names, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Formats duration in seconds to human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (remainingSeconds === 0) {
    return `${minutes}m`
  }
  
  return `${minutes}m ${remainingSeconds}s`
}

/**
 * Announces text to screen readers
 */
export function announceToScreenReader(text: string): void {
  if (typeof window !== 'undefined') {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = text
    
    document.body.appendChild(announcement)
    
    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}