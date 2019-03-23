export class Field {
    constructor(name, rating) {
        this.name = name;
        this.rating = rating;
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

    remove(item) {
        this.storage.remove(item);
    }

}