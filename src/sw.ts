/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope

const sw = self

const CACHE_NAME = 'app-shell-v1'
const APP_SHELL = ['/', '/index.html']

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL)
    }),
  )

  sw.skipWaiting()
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      )
    }),
  )

  event.waitUntil(sw.clients.claim())
})

sw.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
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

export {}
