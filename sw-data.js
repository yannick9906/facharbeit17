/**
 * Created by yanni on 2017-04-16.
 */

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/')
    );
});

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Push Codelab';
    const options = {
        body: 'Yay it works.',
        icon: 'img/launcher-icon-192.png',
        badge: 'images/launcher-icon-192.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});