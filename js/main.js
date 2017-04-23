/**
 * Created by yanni on 2017-04-12.
 */
let swRegistration;
let vw_Account;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


$(document).ready(function() {
    $(".dropdown-button").dropdown();
    // Initialize collapse button
    $(".button-collapse").sideNav();
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    $('.collapsible').collapsible();

    User.getCurrentUser((user) => {
        vw_Account = new view_Account(user, user.dataChanged, user.push);

        //Register Service Workers if not already:
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push is supported');

            navigator.serviceWorker.register('sw-cache.js')
                .then(function(swReg) {
                    console.log('Cache Service Worker is registered', swReg);

                    swRegistration = swReg;
                    initStep2(true);
                })
                .catch(function(error) {
                    console.error('Service Worker Error', error);
                    initStep2(false);
                });
        } else {
            console.warn('Push messaging is not supported');
            initStep2(false);
        }
    });
});

function initStep2(support) {
    vw_Account.showView();
}