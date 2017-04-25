/**
 * Created by yanni on 2017-04-12.
 */
const applicationServerPublicKey = 'BOs6tpM5w5GQldYHXbzXlRjyVT1pKzcz/bKzKjSzdL9ACB2ua0VShEnDLfSpvJoedv5Sm7ErucHDDE7m/lp5lGg=';
let swRegistration;
let vw_Account;
let vw_newList;
let vw_oldList;
let cuser;
let orders;
let oldOrders;
let db;

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

    //Async loading of user details
    User.getCurrentUser((user) => {
        //Create view classes
        cuser = user
        vw_Account = new view_Account(user, user.dataChanged, user.push);
        vw_newList = new view_NewList(() => {}, () => {});
        vw_oldList = new view_OldList(() => {}, () => {});

        $("#nav-username").html(user.realname);
        $("#nav-usermail").html(user.email);
        $("#nav-userchar").html(user.realname.substr(0,1));

        //Register Service Workers if not already:
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push is supported');

            navigator.serviceWorker.register('sw-cache.js')
                .then(function(swReg) {
                    console.log('Cache Service Worker is registered', swReg);

                    swRegistration = swReg;
                    //initialiseUI();
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

function initStep2() {
    setView("new");
}

function resetNavBarHighlights() {
    $("#nav-account").removeClass("active");
    $("#nav-new").removeClass("active");
    $("#nav-old").removeClass("active");
}

function setView(view) {
    resetNavBarHighlights();
    if(view == "new") {
        vw_newList.showView();
        $("#nav-new").addClass("active");
        Order.getAllNewOrders((e) => {
            orders = e;
            console.log(e);
        });
        window.setTimeout(() => {
            console.log("mmh");
            vw_newList.showList(orders);
        }, 1000)
    } else if(view == "old") {
        $("#nav-old").addClass("active");
        vw_oldList.showView();
        Order.getAllOrders((e) => {
            oldOrders = e;
            console.log(e);
            vw_oldList.showList(e);
        })
    } else if(view == "settings") {
        vw_Account.swReg = swRegistration;
        cuser.swReg = swRegistration;
        vw_Account.showView();
        $("#nav-account").addClass("active");
    }
}

function logout() {
    $(location).attr('href', 'appLogin.php?err=3');
}

function order(oID) {

}