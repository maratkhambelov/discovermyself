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
    changerating(obj, rating) {
        const index = this.items.findIndex(item => item.name === obj.name);
        console.log(obj)
        console.log(obj.name)
        console.log(index)
        console.log(rating)
        if (index !== -1) {
            this.items[index].rating = rating;
        }
        this.save();
    }
    addtask(namefield, item) {
        const index = this.items.findIndex(item => item.name === namefield);
        if (index !== -1) {
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
    removebyname(namefield) {
        console.log(namefield)
        const index = this.items.findIndex(item => item.name === namefield);
        console.log(index)
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        this.save();
    }
    addcoord(item, left, top){
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items[index].left = left;
            this.items[index].top = top;
        }
        this.save();
    }
    childrenreplace(itemNew, itemOld, namefield) {
        console.log(itemNew, itemOld)
        const index = this.items.findIndex(item => item.name === namefield);
        if (index !== -1) {
            const objField = this.items[index]
            console.log(objField)
            const itemNewFound = objField.fieldtasks.find(o => o.nametask === itemNew);
            console.log(itemNewFound)
            const itemOldFound = objField.fieldtasks.find(o => o.nametask === itemOld);
            console.log(itemOldFound)
            const indexItemNew = objField.fieldtasks.indexOf(itemNewFound);
            const indexItemOld = objField.fieldtasks.indexOf(itemOldFound);
            console.log(indexItemNew)
            console.log(indexItemOld)
            if(indexItemNew > indexItemOld) {
                const itemSpliced = this.items[index].fieldtasks.splice(indexItemNew, 1);
                console.log(this.items)

                console.log(itemSpliced[0]);

                const newArrayAfterSplice = this.items[index].fieldtasks.splice(indexItemOld, 0, itemSpliced[0]);
            } else {
                const itemSpliced = this.items[index].fieldtasks.splice(indexItemNew, 1);
                console.log(this.items)

                console.log(itemSpliced[0]);

                const newArrayAfterSplice = this.items[index].fieldtasks.splice(indexItemOld - 1, 0, itemSpliced[0]);
            }

        }
        console.log(this.items)
        this.save();
    }

    save() {
        localStorage.setItem('fields', JSON.stringify(this.items));
    }
}