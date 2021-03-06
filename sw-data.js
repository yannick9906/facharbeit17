/**
 * Created by yanni on 2017-04-16.
 */

'use strict';

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    //console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let notifAbout = JSON.parse(event.data.text());
    let title = "Something went wrong";
    let options = {
        body: 'Normally here would be a extremly important Notification. Sorry.',
        icon: 'img/launcher-icon-196.png',
        badge: 'img/launcher-icon-196.png'
    };
    if(notifAbout.info == "statechange") {
        if(notifAbout.orderState == 1) {
            title = "Preisangbot für Bestellung(#"+notifAbout.orderID+"): "+notifAbout.orderPrice+" €";
            options.body = notifAbout.orderName+" für ~"+notifAbout.orderPrice+" €. Tippe hier zum annehmen.";
        } else if(notifAbout.orderState == 3) {
            title = "Deine Bestellung(#"+notifAbout.orderID+") druckt gerade...";
            options.body = notifAbout.orderName+" für ~"+notifAbout.orderPrice+" €. Tippe hier für weitere Infos.";
        } else if(notifAbout.orderState == 4) {
            title = "Druck fertig für #"+notifAbout.orderID+".";
            options.body = notifAbout.orderName+" für "+notifAbout.orderPrice+" €. Tippe hier für weitere Infos.";
        } else if(notifAbout.orderState == -1) {
            title = "Bestellung #"+notifAbout.orderID+" angelehnt.";
            options.body = notifAbout.orderName+" für ~"+notifAbout.orderPrice+" €. Aufgrund eines techn. Problems wurde die Bestellung abgelehnt.";
        } else if(notifAbout.orderState == -2) {
            title = "Bestellung #"+notifAbout.orderID+" angelehnt.";
            options.body = notifAbout.orderName+" für ~"+notifAbout.orderPrice+" €. Dieses Objekt ist nicht druckbar.";
        } else {
            title = "Neuigkeiten zu Bestellung #"+notifAbout.orderID+".";
            options.body = notifAbout.orderName+" für ~"+notifAbout.orderPrice+" €. Tippe hier für weitere Infos.";
        }
    } else if(notifAbout.info == "custom") {
        title = notifAbout.title;
        options.body = notifAbout.body;
    }

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://sl.yannickfelix.ml/fa/appUser.html')
    );
});