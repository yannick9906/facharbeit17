/**
 * Created by yanni on 2017-04-16.
 */

class view_Account {
    constructor(user, cb_dataChanged, cb_pushReq) {
        this.user = user;
        this.cb_dataChanged = cb_dataChanged;
        this.cb_pushReq = cb_pushReq;
        this.swReg = undefined;
        this.template = Handlebars.compile(`
        <div class="container" id="userSettings">
        <form class="row card-panel">
            <div class="input-field col s12 m6">
                <input id="edit-usrname" type="text" disabled value="{{username}}">
                <label for="edit-usrname">Benutzername</label>
            </div>
            <div class="input-field col s12 m6">
                <input id="edit-realname" type="text" disabled value="{{realname}}">
                <label for="edit-realname">Vor- und Nachname</label>
            </div>
            <div class="input-field col s12 m6">
                <input id="edit-passwd1" type="password">
                <label for="edit-passwd1">neues Passwort</label>
            </div>
            <div class="input-field col s12 m6">
                <input id="edit-passwd2" type="password">
                <label for="edit-passwd2">Passwort wiederholen</label>
            </div>
            <div class="input-field col s10 m8">
                <input id="edit-email" type="email" value="{{mail}}">
                <label for="edit-email">Email Adresse</label>
            </div>
            <div class="switch col s2 m2" style="margin-top: 17px;">
                <label>
                    <input type="checkbox" id="edit-recv-emails" {{{recvmail}}}>
                    <span class="lever"></span>
                    <p class="hide-on-med-and-down">Emails erhalten</p>
                </label>
            </div>
            <button class="hide-on-med-and-down btn orange waves-effect waves-light col s12 m2 offset-m1" id="btn-confirm-mail" type="button" style="margin-top: 15px; margin-left: -12px;">
                <i class="mddi mddi-check"></i>
            </button>
            <button class="hide-on-large-only btn orange waves-effect waves-light col s12" id="btn-confirm-mail" type="button">
                <i class="mddi mddi-check"></i>
            </button>
            <button disabled id="btn-recv-push" class="js-push-btn btn orange waves-effect col s12" style="margin-top: 10px;">
                Push-Benarichtigungen aktivieren
            </button>
        </form>
    </div>
        `);
    }

    showView() {
        $("#main").html(this.template({
            username: this.user.username,
            realname: this.user.realname,
            mail: this.user.email,
            recvmail: this.user.recvEmail==1 ? "checked" : ""
        }));
        Materialize.updateTextFields();
        $("#btn-confirm-mail").on("click", this.preDataChanged.bind(this));
        $("#btn-recv-push").on("click", this.cb_pushReq);

        let thisclass = this;
        this.pushButton = document.querySelector('.js-push-btn');
        this.pushButton.addEventListener('click', function() {
            thisclass.pushButton.disabled = true;
            if (thisclass.user.isSubscribed) {
                // TODO: Unsubscribe user
            } else {
                thisclass.user.subscribeUser(thisclass.updatePushButton.bind(thisclass));
            }
        });

        // Set the initial subscription value
        thisclass.swReg.pushManager.getSubscription()
            .then(function(subscription) {
                thisclass.user.isSubscribed = !(subscription === null);

                thisclass.user.updateSubscriptionOnServer(thisclass.swReg, subscription);

                if (thisclass.user.isSubscribed) {
                    console.log('User IS subscribed.');
                } else {
                    console.log('User is NOT subscribed.');
                }
                thisclass.updatePushButton.bind(thisclass)();
            });
    }

    updatePushButton() {
        if (Notification.permission === 'denied') {
            this.pushButton.textContent = 'Push Messaging Blocked.';
            this.pushButton.disabled = true;
            this.user.updateSubscriptionOnServer(null);
            return;
        }

        if (this.user.isSubscribed) {
            this.pushButton.textContent = 'Benarichtigungen deaktivieren';
        } else {
            this.pushButton.textContent = 'Benarichtigungen aktivieren';
        }

        this.pushButton.disabled = false;
    }

    preDataChanged() {
        this.cb_dataChanged($("#edit-passwd1").val(), $("#edit-passwd2").val(), $("#edit-email").val(), $("#edit-recv-emails").is(":checked"))
    }
}