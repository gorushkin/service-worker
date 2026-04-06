const CACHE_NAME = 'app-shell-v1'
const APP_SHELL = ['/', '/index.html']
const TODO_URL = 'https://jsonplaceholder.typicode.com/todos/1'
const OFFLINE_TODO = {
  userId: 0,
  id: 1,
  title: 'offline mode: service worker returned fallback data',
  completed: false,
  source: 'offline-fallback',
}

self.addEventListener('install', (event) => {
  console.log('SW install')

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL)
    }),
  )

  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('SW activate')

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      )
    }),
  )

  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  console.log('SW fetch:', request.url)

  if (request.method !== 'GET') {
    return
  }

  if (request.url === TODO_URL) {
    event.respondWith(handleTodoRequest(request))
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((networkResponse) => {
        const responseClone = networkResponse.clone()

        void caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone)
        })

        return networkResponse
      })
    }),
  )
})

async function handleTodoRequest(request) {
  try {
    const networkResponse = await fetch(request)
    const responseClone = networkResponse.clone()

    void caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, responseClone)
    })

    return networkResponse
  } catch {
    return new Response(JSON.stringify(OFFLINE_TODO), {
      headers: {
        'Content-Type': 'application/json',
        'X-Data-Source': 'service-worker-offline-fallback',
      },
      status: 200,
    })
  }
}
