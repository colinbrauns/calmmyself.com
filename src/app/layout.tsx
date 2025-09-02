import type { Metadata, Viewport } from 'next'
import './globals.css'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

export const metadata: Metadata = {
  title: 'CalmMyself - Your Personal Calm Toolbox',
  description: 'Quick access to tools for nervous system regulation and calming techniques',
  keywords: 'calm, anxiety, breathing, mindfulness, grounding, mental health',
  authors: [{ name: 'CalmMyself Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CalmMyself',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'CalmMyself',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="allow-animations">
      <body className="min-h-screen bg-gradient-to-br from-calm-50 to-grounding-50 antialiased">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
