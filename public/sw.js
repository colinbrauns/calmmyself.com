// Service Worker for CalmMyself PWA
const CACHE_NAME = 'calmmyself-v1.1.0'
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
        // Pre-cache minimal assets if desired (avoid HTML to reduce staleness)
        return cache.addAll(['/manifest.json'])
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

  const req = event.request

  // Network-first for HTML documents to avoid stale pages
  if (req.destination === 'document') {
    event.respondWith(
      fetch(req).then((res) => {
        const resClone = res.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
        return res
      }).catch(() => caches.match(req))
    )
    return
  }

  // Cache-first for Next.js hashed static assets
  if (req.url.includes('/_next/static/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const resClone = res.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
          }
          return res
        })
      })
    )
    return
  }

  // Stale-while-revalidate for others
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.status === 200) {
          const resClone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
        }
        return res
      }).catch(() => cached)
      return cached || fetchPromise
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
