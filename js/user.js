/**
 * Created by yanni on 2017-04-23.
 */

class User {
    constructor(uid, username, realname, email, recvEmail) {
        this.uid = uid;
        this.username = username;
        this.realname = realname;
        this.email = email;
        this.recvEmail = recvEmail;
        this.isSubscribed = false;
        console.log(this.recvEmail);
    }

    static getCurrentUser(callback) {
        let db = new Dexie("userdata");
        db.version(1).stores({users:'id,uid,username,realname,email,recvmail,time'});
        //Try loading from server
        $.ajax({type: "get",
            url: "api/users/details.php?id=0",
            success: (json) => {
                json = JSON.parse(json);
                if (json.success != false) {
                    console.log("[User] Loading info from Server...");
                    callback(new User(json.id, json.username, json.realname, json.email, json.recvEmails?1:0));
                    db.users.put({
                        id: 1,
                        uid: json.id,
                        username: json.username,
                        realname: json.realname,
                        email: json.email,
                        recvmail: json.recvEmails?1:0,
                        time: new Date()
                    })
                }
            },
            error: (xhr, status, err) => {
                console.log("[User] Loading info from db, hence offline...");
                db.users.get(1).then((currentUserData) => {
                    callback(new User(currentUserData.uid, currentUserData.username, currentUserData.realname, currentUserData.email, currentUserData.recvmail));
                });
            }
        });
    }

    dataChanged(password1, password2, email, recvEmails) {
        console.log(recvEmails);
        let db = new Dexie("userData");
        db.version(1).stores({users:'id,uid,username,realname,email,recvmail,time'});
        db.users.put({
            id: 1,
            uid: this.uid,
            username: this.username,
            realname: this.realname,
            email: email,
            recvmail: recvEmails,
            time: new Date()
        });
        let hash = undefined;
        if(password1 == password2 && password1 != "") {
            hash = md5(password1);
        }
        $.post("api/users/update.php", {passhash: hash, email: email, recvEmails: recvEmails}, (data) => {
            this.recvEmail = recvEmails;
            this.email = email;
            Materialize.toast("Änderungen auf dem Server gespeichert.",2000,"green");
        }).error((a,b,c) => {
            Materialize.toast("Server nicht erreichbar.",5000,"red");
        });
    }

    push_changed() {

    }

    updateSubscriptionOnServer(sw, subscription) {
        if(subscription) {
            $.post("api/users/setPush.php",{endpoint: JSON.stringify(subscription)},function(data) {
                let title = "Push Benachrichtigung";
                let options = {
                    body: 'Aktiviere Push-Benachrichtigungen...',
                    icon: '/new/printer-3d-196.png',
                    badge: '/new/printer-3d-196.png'
                };
                sw.showNotification(title, options);
            });
        }
    }

    subscribeUser(updateBtn) {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        let thisclass = this;
        swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function(subscription) {
                console.log('User is subscribed.');

                thisclass.updateSubscriptionOnServer(subscription);

                thisclass.isSubscribed = true;

                updateBtn();
            })
            .catch(function(err) {
                console.log('Failed to subscribe the user: ', err);
                updateBtn();
            });
    }
}