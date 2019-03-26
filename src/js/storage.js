export class LocalStorage {
    constructor() {
        const savedItems = JSON.parse(localStorage.getItem('fields'));
        if (savedItems !== null) {
            this.items = savedItems;
        } else {
            this.items = [];
        }
    }
    add(item) {
        this.items.push(item); // в конец
        this.save();
    }
    addtask(namefield, item) {
        const index = this.items.findIndex(item => item.name === namefield);
        if (index !== -1) {
            console.log(index)
            this.items[index].fieldtasks.push(item);
        }
        this.save()
    }
    remove(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        this.save();
    }
    addcoord(item, coordx, coordy){
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items[index].coordx = coordx;
            this.items[index].coordy = coordy;

        }
        this.save();
    }
    save() {
        localStorage.setItem('fields', JSON.stringify(this.items));
    }
}