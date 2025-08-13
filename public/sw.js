// Service Worker for CalmMyself PWA
const CACHE_NAME = 'calmmyself-v1.0.0'
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/css/app/page.css',
  // Add other static assets as needed
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        // Cache the main page at minimum
        return cache.add('/')
      })
      .catch((error) => {
        console.log('Cache add failed:', error)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Return offline page if available
            if (event.request.destination === 'document') {
              return caches.match('/')
            }
          })
      })
  )
})

// Background sync for analytics (if needed later)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag)
})

// Push notification support (for future crisis alerts if needed)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)
})