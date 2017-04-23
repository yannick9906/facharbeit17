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
    }

    static getCurrentUser(callback) {
        let db = new Dexie("userData");
        db.version(1).stores({users:'id,uid,username,realname,email,recvmail'});
        db.users.get(1).then((currentUserData) => {
            callback(new User(currentUserData.uid, currentUserData.username, currentUserData.realname, currentUserData.email, currentUserData.recvmail));
        });
    }

    dataChanged() {

    }

    emailChanged() {

    }

    push() {

    }
}