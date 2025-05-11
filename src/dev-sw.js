self.addEventListener('install', (event) => {
    console.log('Dev Service Worker installed.');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Dev Service Worker activated.');
    self.clients.claim();

    
    
  });
  
  self.addEventListener('push', (event) => {
    console.log('Push event received (Dev SW)');
    const data = event.data ? event.data.text() : 'No payload';
    event.waitUntil(
      self.registration.showNotification('Dev Push Notification', {
        body: data,
      })
    );
  });
  