// Minimal Service Worker for TobuGo PWA
console.log('Service Worker file loaded');

self.addEventListener('install', event => {
  console.log('Service Worker: Install');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activate');
  event.waitUntil(self.clients.claim());
});