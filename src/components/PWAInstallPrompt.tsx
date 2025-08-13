'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay to not be too intrusive
      setTimeout(() => {
        setShowPrompt(true)
      }, 30000) // 30 seconds after page load
    }

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice
    
    console.log(`User response to the install prompt: ${outcome}`)
    
    // Reset the deferred prompt variable
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-calm-200 rounded-lg shadow-lg p-4 z-50 max-w-md mx-auto">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-calm-100 rounded-full flex items-center justify-center">
          <Download className="w-5 h-5 text-calm-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Install CalmMyself
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Get instant access to calming tools, even when offline. Install our app for the best experience.
          </p>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleInstallClick}
              variant="calm"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Download size={16} />
              <span>Install</span>
            </Button>
            
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-gray-500"
            >
              Not now
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  )
}