/**
 * Created by yanni on 2017-04-23.
 */

class Order {
    constructor(oID, uID, filamentType, date_created, date_confirmed, date_completed, state, comment, precision, order_name, order_link, material_length, material_weight, print_time, cost, order_livestream, order_pic, material_cost, energy_cost, total_cost) {
        this.oID = oID;
        this.date_created = date_created;
        this.date_confirmed = date_confirmed;
        this.date_completed = date_completed
        this.state = state;
        this.comment = comment;
        this.precision = precision;
        this.order_name = order_name;
        this.order_link = order_link;
        this.material_length = material_length;
        this.material_weight = material_weight;
        this.print_time = print_time;
        this.cost = cost;
        this.material_cost = material_cost;
        this.energy_cost = energy_cost;
        this.total_cost = total_cost;
        this.order_livestream = order_livestream;
        this.order_pic = order_pic;
        this.uID = uID;
        let thisclass = this;
        FilamentType.getByFID(filamentType, (e) => {
            console.log(e);
            thisclass.filamentType = e;
        });
    }

    static getAllNewOrders(callback) {
        let db = new Dexie("userdata");
        db.version(2).stores({orders:'oID, uID, filamentType, date_created, date_confirmed, date_completed, state, comment, precision, order_name, order_link, material_length, material_weight, print_time, cost, order_livestream, order_pic, material_cost, energy_cost, total_cost'});
        //Try loading from server
        $.ajax({type: "get",
            url: "api/orders/getList.php?type=new",
            success: (json) => {
                json = JSON.parse(json);
                if (json.success != false) {
                    //db.orders.delete();
                    console.log("[Orders] Loading info from Server...");
                    let list = [];
                    for(let i = 0; i < json.orders.length; i++) {
                        db.orders.put(json.orders[i]);
                        list[json.orders[i].oID] = new Order(json.orders[i].oID, json.orders[i].uID, json.orders[i].filamentType, json.orders[i].date_created, json.orders[i].date_confirmed, json.orders[i].date_completed, json.orders[i].state, json.orders[i].comment, json.orders[i].precision, json.orders[i].order_name, json.orders[i].order_link, json.orders[i].material_length, json.orders[i].material_weight, json.orders[i].print_time, json.orders[i].cost, json.orders[i].order_livestream, json.orders[i].order_pic, json.orders[i].material_cost, json.orders[i].energy_cost, json.orders[i].total_cost);
                    }
                    callback(list);
                }
            },
            error: (xhr, status, err) => {
                console.log("[Orders] Loading info from db, hence offline...");
                let list = [];
                db.orders.each((order) => {
                    list.push(new Order(order.oID, order.uID, order.filamentType, order.date_created, order.date_confirmed, order.date_completed, order.state, order.comment, order.precision, order.order_name, order.order_link, order.material_length, order.material_weight, order.print_time, order.cost, order.order_livestream, order.order_pic, order.material_cost, order.energy_cost, order.total_cost));
                }).then(() => {
                    callback(list);
                });
            }
        });
    }

    static getAllOrders(callback) {
        let db = new Dexie("userdata");
        db.version(2).stores({oldorders:'oID, uID, filamentType, date_created, date_confirmed, date_completed, state, comment, precision, order_name, order_link, material_length, material_weight, print_time, cost, order_livestream, order_pic, material_cost, energy_cost, total_cost'});
        //Try loading from server
        $.ajax({type: "get",
            url: "api/orders/getList.php?type=old",
            success: (json) => {
                json = JSON.parse(json);
                if (json.success != false) {
                    //db.oldorders.delete();
                    console.log("[Orders] Loading info from Server...");
                    let list = [];
                    for(let i = 0; i < json.orders.length; i++) {
                        db.oldorders.put(json.orders[i]);
                        list[json.orders[i].oID] = new Order(json.orders[i].oID, json.orders[i].uID, json.orders[i].filamentType, json.orders[i].date_created, json.orders[i].date_confirmed, json.orders[i].date_completed, json.orders[i].state, json.orders[i].comment, json.orders[i].precision, json.orders[i].order_name, json.orders[i].order_link, json.orders[i].material_length, json.orders[i].material_weight, json.orders[i].print_time, json.orders[i].cost, json.orders[i].order_livestream, json.orders[i].order_pic, json.orders[i].material_cost, json.orders[i].energy_cost, json.orders[i].total_cost);
                    }
                    callback(list);
                }
            },
            error: (xhr, status, err) => {
                console.log("[Orders] Loading info from db, hence offline...");
                let list = [];
                db.oldorders.each((order) => {
                    list.push(new Order(order.oID, order.uID, order.filamentType, order.date_created, order.date_confirmed, order.date_completed, order.state, order.comment, order.precision, order.order_name, order.order_link, order.material_length, order.material_weight, order.print_time, order.cost, order.order_livestream, order.order_pic, order.material_cost, order.energy_cost, order.total_cost));
                }).then(() => {
                    callback(list);
                });
            }
        });
    }
}