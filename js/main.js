/**
 * Created by yanni on 2017-04-12.
 */

$(document).ready(function() {
    $(".dropdown-button").dropdown();
    // Initialize collapse button
    $(".button-collapse").sideNav();
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    $('.collapsible').collapsible();

    //Register Service Workers if not already:
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');

        navigator.serviceWorker.register('sw-cache.js')
            .then(function(swReg) {
                console.log('Cache Service Worker is registered', swReg);

                swRegistration = swReg;
            })
            .catch(function(error) {
                console.error('Service Worker Error', error);
            });
    } else {
        console.warn('Push messaging is not supported');
        pushButton.textContent = 'Push Not Supported';
    }
});