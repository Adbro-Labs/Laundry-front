self.addEventListener('install', event => {
  console.log('Dev Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Dev Service Worker activated.');
  self.clients.claim();
});

self.addEventListener('push', event => {
  const data = event.data ? event.data?.json() : null;
  if (data) {
    const interval = data?.data?.interval;
    if (interval > 0) {
      event.waitUntil(
        self.registration.showNotification(data.title, {
          body: `Bills to be delivered in ${data?.data?.interval} minutes: ${data?.data?.orderIds}`,
          tag: 'delivery',
        })
      );
    } else {
      event.waitUntil(
        self.registration.showNotification(data.title, {
          body: `Missed delivery: ${data?.data?.orderIds}`,
          tag: 'delivery',
        })
      );
    }
  }
});

importScripts('ngsw-worker.js')
