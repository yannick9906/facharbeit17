/**
 * Created by yanni on 2017-04-23.
 */

class FilamentType {

    constructor(fid, colorname, colorcode, price, pricesale, active, diameter) {
        this.fid = fid;
        this.colorname = colorname;
        this.colorcode = colorcode;
        this.price = price;
        this.pricesale = pricesale;
        this.active = active;
        this.diameter = diameter;
    }

    static getAllActiveFilaments(callback) {
        let db = new Dexie("userData");
        db.version(1).stores({filaments:'fid,colorname,colorcode,price,pricesale,active,diameter'});
        db.filaments.where("active").equals(1).each((filament) => {
            callback(new FilamentType(filament.fid,filament.colorname,filament.colorcode,filament.price,filament.pricesale,filament.active,filament.diameter));
        });
    }

    dataChanged() {

    }
}