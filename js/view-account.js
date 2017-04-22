/**
 * Created by yanni on 2017-04-16.
 */

class view_Account {
    constructor(swReg) {
        //Template for HTML Code Generation
        this.pushNotifBtn = undefined;
        this.template = Handlebars.compile(`
<div class="container">
    <div class="row">
        <div class="col s12 m5 card-panel">
            <span class="header teal-text">account daten</span>
        </div>
        <div class="col s12 m5 offset-m1 card-panel">
            <div class="container row">
                <div class="header teal-text col s12">einstellungen</div>
                <span class="text-black col s6">Push Benachrichtigungen: </span><a href="#!" class="btn teal col s6" id="pushNotifBtn">{{{pushtext}}}</a>
            </div>
        </div>
    </div>
</div>
        `);
        try {
            let thisClass = this;
            this.swRegistration = swReg;
            this.swRegistration.pushManager.getSubscription()
                .then(function (subscription) {
                    thisClass.isSubscribed = !(subscription === null);

                    //updateSubscriptionOnServer(subscription);

                    if (thisClass.isSubscribed) {
                        console.log('User IS subscribed.');
                    } else {
                        console.log('User is NOT subscribed.');
                    }
                });
        } catch(e) {}
    }

    showView() {
        let pushtext = "erlauben";
        if(this.isSubscribed) pushtext = "stopp";

        $("#main").html(this.template({pushtext: pushtext}));
        this.pushNotifBtn = $("#pushNotifBtn");
        this.pushNotifBtn.on("click", this.lstnr_pushNotificationsButton.bind(this));
    }

    lstnr_pushNotificationsButton() {
        console.log(this.pushNotifBtn);
        this.pushNotifBtn.addClass('disabled');
        if (this.isSubscribed) {
            this.unsubscribeUser();
        } else {
            this.subscribeUser();
        }
    }

    updatePushNotifButton() {
        this.pushNotifBtn.removeClass('disabled')
        if (this.isSubscribed) {
            this.pushNotifBtn.html("stopp");
        } else {
            this.pushNotifBtn.html("erlauben");
        }
    }

    subscribeUser() {
        let thisClass = this;
        const applicationServerKey = urlB64ToUint8Array("BEQNpSMy1kaNZzSQcppZvaPx8mY2-v4YLWK61tAK_HBw5Cpy_ihyqLiZg2VbPeJMs1MdlSIK4N7JabWIM_UOR-o");
        this.swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function(subscription) {
                console.log('User is subscribed.');

                //updateSubscriptionOnServer(subscription);
                console.log(JSON.stringify(subscription));

                thisClass.isSubscribed = true;

                thisClass.updatePushNotifButton();
            })
            .catch(function(err) {
                console.log('Failed to subscribe the user: ', err);
                thisClass.updatePushNotifButton();
            });
    }

    unsubscribeUser() {
        let thisClass = this;
        this.swRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                if (subscription) {
                    return subscription.unsubscribe();
                }
            })
            .catch(function(error) {
                console.log('Error unsubscribing', error);
            })
            .then(function() {
                //updateSubscriptionOnServer(null);

                console.log('User is unsubscribed.');
                thisClass.isSubscribed = false;

                thisClass.updatePushNotifButton();
            });
    }
}