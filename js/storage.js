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
        this.items.push(item);
        this.save();
    }
    changerating(obj, rating) {
        const index = this.items.findIndex(item => item.name === obj.name);

        if (index !== -1) {
            this.items[index].rating = rating;
        }
        this.save();
    }
    addtask(namefield, item) {
        let time = 1;
        console.log(time)
        const index = this.items.findIndex(item => item.name === namefield);
        console.log(this.items[index])
        console.log(item)
        if (index !== -1) {
            this.items[index].fieldtasks.push(item);
        }
        console.log(this.items)

        this.save()
    }
    removetask(indexfield, task) {
        console.log(this.items)
        console.log(indexfield);
        console.log(task)
        const taskList = this.items[indexfield].fieldtasks;
        console.log(taskList)
        const indexTask = this.items[indexfield].fieldtasks.findIndex(item => item.nametask === task.nametask)
        taskList.splice(indexTask, 1);
        console.log(taskList)
        this.save();
    }
    changedone(indexfield, task) {
        const field = this.items[indexfield];
        const taskList = this.items[indexfield].fieldtasks;
        const indexTask = this.items[indexfield].fieldtasks.findIndex(item => item.nametask === task.nametask)
        taskList[indexTask].done = true;
        field.rating = parseFloat(field.rating) + 1.0;
        if(field.rating >= 10) {
            field.rating = 10;
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
        console.log(itemNew)
        console.log(itemOld)
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
            } else if(indexItemNew === indexItemOld) {
                const itemSpliced = this.items[index].fieldtasks.splice(indexItemNew, 1);
                this.items[index].fieldtasks.push(itemNewFound);
            }
            else {
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