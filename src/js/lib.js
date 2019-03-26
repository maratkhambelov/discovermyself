export class Field {
    constructor(name, rating, coordx, coordy) {
        this.name = name;
        this.rating = 0;
        this.id = 0;
        this.coordx = this.coordx;
        this.coordy = this.coordy;
        this.fieldtasks = [];

    }
}
export class FieldList {

    constructor(storage) {
        this.storage = storage;
    }

    get items() {
        return this.storage.items;
    }
    add(item) {
        this.storage.add(item);
    }
    addtask(namefield, item) {
        this.storage.addtask(namefield, item)
    }

    remove(item, coordx, coordy) {
        this.storage.remove(item);
    }
    addcoord(item, coordx, coordy){
        this.storage.addcoord(item, coordx, coordy);
    }

}

export class FieldTask{
    constructor(nametask) {
        this.nametask = nametask;
    }
}