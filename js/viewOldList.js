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
        this.templateList = Handlebars.compile(`
<div class="container row" id="list">
        
</div>
        `);
        this.templateListElement = Handlebars.compile(`
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-image" style="max-width: 35%; width: 35%;">
                    <img id="pic{{oID}}" src="{{pic}}">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <span class="orange-text text-darken-2" style="font-size: 16px;"><b>{{order_name}}</b></span>
                        <span class="grey-text text-darken-1 light-bold right" style="font-size: 22px; vertical-align: top; line-height: 26px;">{{complete_price}}<i class="mddi mddi-currency-eur"></i></span>
                        <p style="margin-top: 5px;">
                            <i class="mddi mddi-altimeter grey-text text-darken-1"></i> <b>Schichtdicke:</b> 0,{{precision}} mm<span class="bg badge {{statecolor}}">{{statetext}}</span><br/>
                            <i class="mddi mddi-format-color-fill grey-text text-darken-1"></i> <b>Material:</b> {{filamentcolorname}}<br/>
                            <i class="mddi mddi-weight grey-text text-darken-1"></i> <b>Gewicht:</b> {{material_weight}} g<br/>
                            <i class="mddi mddi-clock-out  grey-text text-darken-1"></i> <b>Angenommen am</b> {{date_confirmed}}<br/>
                            <i class="mddi mddi-clock-fast grey-text text-darken-1"></i> <b>Voraus. fertig am</b> {{date_completed}}<br/>
                        </p>
                        {{{printing}}}
                    </div>
                    <div class="card-action" style="padding: 10px;">
                        <a href="#" class="btn-flat btn-condensed disabled">
                            <i class="mddi mddi-information-outline"></i> Details
                        </a>
                    <a href="#" {{{order}}} class="btn-flat btn-condensed green-text" id="btn-order" onclick="order({{oid}})"><i class="mddi mddi-check"></i> Bestellen</a>
                    <a href="#" {{{reorder}}} class="btn-flat btn-condensed green-text" id="btn-reorder" onclick="reorder({{oid}})"><i class="mddi mddi-check-all"></i> Erneut bestellen</a>
                    <a href="#" {{{arrived}}} class="btn-flat btn-condensed green-text" id="btn-arrived" onclick="arrived({{oid}})"><i class="mddi mddi-package"></i> Zustellung annehmen</a>
                    <a href="#" {{{warranty}}} class="btn-flat btn-condensed" id="btn-warranty" onclick="warranty({{oid}})"><i class="mddi mddi-cached"></i> Garantiefall</a>
                    <a href="#" {{{delete}}} class="btn-flat btn-condensed red-text" id="btn-delete" onclick="delete({{oid}})"><i class="mddi mddi-delete"></i> Löschen</a>
                    </div>
                </div>
            </div>
        </div>
        `);
    }

    showView() {
        $("#main").html(this.templateBasic({}));
        Materialize.updateTextFields();
        $("#newOrderBtn").on("click", this.showNewOrderView.bind(this));
    }

    showList(orders) {
        let stateColors = ["red darken-2","red","blue","blue","green","green","green","green","green","red","orange"];
        let stateNames = ["Technisches Problem", "Nicht druckbar", "Erstellt","Preisangebot","Bestellt","Druckt...","Druck fertig","Zugestellt","Abgeschlossen","Gelöscht","Garantiefall"];
        $("#main").html(this.templateList({}))
        for(let i = 0; i < orders.length; i++) {
            let order = orders[i];
            if(order) {
                let data = {
                    oID: order.oID,
                    pic: typeof order.order_pic == "string" ? order.order_pic : "img/placeholder.png",
                    complete_price: (order.total_cost / 100).toFixed(2),
                    order_name: order.order_name,
                    precision: order.precision,
                    filamentcolorname: order.filamentType,
                    material_weight: order.material_weight,
                    date_confirmed: order.date_confirmed,
                    date_completed: order.date_completed,
                    printing: order.state == 3 ? "<div class='progress' style='margin-bottom: -10px;'><div class='indeterminate'></div></div>" : (order.state >= 4 ? "<div class='progress' style='margin-bottom: -10px;'><div class='determinate' style='width: 100%;'></div></div>" : ""),
                    order: order.state == 1 ? "":"style='display: none'",
                    reorder: order.state != 0 ? "":"style='display: none'",
                    arrived: order.state == 5 ? "":"style='display: none'",
                    warranty: order.state >= 5 ? "":"style='display: none'",
                    delete: (order.state == 6 || order.state <= 1) ? "":"style='display: none'",
                    statecolor: stateColors[parseInt(order.state)+2],
                    statetext: stateNames[parseInt(order.state)+2]
                }
                $("#list").append(this.templateListElement(data));
            }
        }
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