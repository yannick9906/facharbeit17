/**
 * Created by yanni on 2017-04-23.
 */

class view_OldList {
    constructor(cb_newOrder, cb_OrderAction) {
        this.cb_newOrder = cb_newOrder;
        this.cb_OrderAction = cb_OrderAction;
        this.templateBasic = Handlebars.compile(`
    <div class="container">
        <div class="center-block" id="loading">
            <div class="card-panel grey lighten-2 center" style="height: 10%;">
                <p>Lade aktive Bestellungen...</p>
            </div>
        </div>
        <div class="row" id="list">
            
        </div>
        <div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
            <a href="#" class="btn-floating btn-large green tooltipped" id="newOrderBtn" data-position="left" data-delay="50" data-tooltip="Neuen Auftrag erstellen">
                <i class="large mddi mddi-plus"></i>
            </a>
        </div>
    </div>
        `);

        this.templateNew = Handlebars.compile(`
    <div class="container" id="new">
        <form class="row card-panel">
            <div class="input-field col s12 m6">
                <input id="newordertitle" type="text">
                <label for="newordertitle">Bestellungstitel</label>
            </div>
            <div class="input-field col s12 m6">
                <select class="icons" id="neworderfilament">
                    <option value="" disabled selected>Wähle ein Material</option>
                </select>
                <label for="neworderfilament">Material</label>
            </div>
            <div class="input-field col s12">
                <input id="neworderurl" type="url">
                <label for="neworderurl">Link zum Objekt (z.B Thingiverse)</label>
            </div>
            <div class="col s12 center">
                <img src="#" height="100px" id="preview"/>
            </div>
            <div class="input-field col s12">
                <textarea id="newordercomment" class="materialize-textarea"></textarea>
                <label for="newordercomment">Kommentar</label>
            </div>
            <button class="btn orange waves-effect waves-light col s12" id="submitNewOrder" type="button">
                <i class="mddi mddi-basket-fill"></i>
            </button>
        </form>
    </div>
        `);
    }

    showView() {
        $("#main").html(this.templateBasic({}));
        Materialize.updateTextFields();
        $("#newOrderBtn").on("click", this.showNewOrderView.bind(this));
    }

    showList(data) {

    }

    showNewOrderView() {
        $("#main").html(this.templateNew({}));
        Materialize.updateTextFields();
        $("#neworderurl").on("keyup", this.refreshPreview.bind($("#neworderurl"),$("#preview")));
        $("#submitNewOrder").on("click", this.preSubmitNewOrder.bind(this))
    }

    refreshPreview(into) {
        let link = $(this).val().toString();
        console.log(link);
        if(link.includes("thingiverse")) {
            into.attr("src", "img/loading2.gif");
            $.getJSON("../new/orders.php?action=getThingiverseImg", {link: link}, function (data) {
                if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
                else into.attr("src", data["link"]);
            });
        } else {
            into.attr("src", "img/loading2.gif");
        }
    }

    preSubmitNewOrder() {

    }
}