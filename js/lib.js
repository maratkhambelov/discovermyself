export class Field {
    constructor(name, rating) {
        this.name = name;
        this.rating = 0;
        this.id = 0;
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
    changerating(obj, rating) {
        this.storage.changerating(obj, rating);
    }


    addtask(namefield, item) {
        this.storage.addtask(namefield, item)

    }
    removetask(indexfield, task) {
        this.storage.removetask(indexfield, task);
    }
    changedone (indexfield, task) {
        this.storage.changedone(indexfield, task)
    }
    remove(item, coordx, coordy) {
        this.storage.remove(item);
    }
    addcoord(item, left, top){
        this.storage.addcoord(item, left, top);
    }
    removebyname(namefield) {
        this.storage.removebyname(namefield)
    }
    childrenreplace(itemNew, itemOld, namefield) {
        this.storage.childrenreplace(itemNew, itemOld, namefield)
    }

}

export class FieldTask{
    constructor(nametask, done) {
        this.nametask = nametask;
        this.done = false;
    }

}