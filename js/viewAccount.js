/**
 * Created by yanni on 2017-04-16.
 */

class view_Account {
    constructor(user, cb_dataChanged, cb_pushReq) {
        this.user = user;
        this.cb_dataChanged = cb_dataChanged;
        this.cb_pushReq = cb_pushReq;
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
            <div class="input-field col s12 m5">
                <input id="edit-passwd1" type="password">
                <label for="edit-passwd1">neues Passwort</label>
            </div>
            <div class="input-field col s12 m4">
                <input id="edit-passwd2" type="password">
                <label for="edit-passwd2">Passwort wiederholen</label>
            </div>
            <button class="btn orange waves-effect waves-light col s12 m2" id="btn-confirm" type="button" style="margin-top: 12px;">
                <i class="mddi mddi-check"></i>
            </button>
            <div class="input-field col s10 m7">
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
            <button class="hide-on-med-and-down btn orange waves-effect waves-light col s12 m2 offset-m2" id="btn-confirm-mail" type="button" style="margin-top: -50px;">
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
            recvmail: this.user.recvEmails ? "" : "checked"
        }));
        Materialize.updateTextFields();
        $("#btn-confirm").on("click", this.cb_dataChanged);
        $("#btn-confirm-mail").on("click", this.cb_dataChanged);
        $("#btn-recv-push").on("click", this.cb_pushReq);
    }
}