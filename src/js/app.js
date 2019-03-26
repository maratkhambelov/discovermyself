import {Field, FieldList, FieldTask} from './lib.js';
import {LocalStorage} from './storage.js';

const divBySelfEl = document.querySelector('#div_byself');
const commonDivEl = document.querySelector('#commondiv_group');
const nameFieldInput = document.querySelector('#name_field');
const addBtnEl = document.querySelector('#addbtn');
const divFields = document.querySelector('#div_fields');
let draggable = null;

const fieldList = new FieldList(new LocalStorage());
rebuildTree(commonDivEl, fieldList)
let showWindow = false;
nameFieldInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        addField();
    }
});

addBtnEl.addEventListener('click', (event) => {
    addField();
});



function rebuildTree(container, list) {
    container.innerHTML = '';
    for (const item of list.items) {
        const itemEl = document.createElement('div');
        itemEl.className = "div__field"
        itemEl.draggable = true;


        itemEl.innerHTML = `
        <span data-id="text">${item.name}</span>
        <button data-id="remove" class="btn btn-danger btn-sm float-right">Rmv</button>`
        itemEl.style.position = 'absolute';
        itemEl.style.left = item.coordx;
        itemEl.style.top = item.coordy;


        itemEl.onmousedown = function(e) {
            moveAt(e);
            itemEl.style.position = 'absolute';

            commonDivEl.appendChild(itemEl);
            itemEl.style.zIndex = 1000;
            function moveAt (e) {
                itemEl.style.left = e.pageX - itemEl.offsetWidth / 2 + 'px';
                itemEl.style.top = e.pageY - itemEl.offsetHeight / 2 + 'px';

            }
            document.onmousemove = function (e) {
                moveAt(e);
            }
            itemEl.onmouseup = function () {
                document.onmousemove = null;
                itemEl.onmouseup = null;
                console.log(itemEl.style.left)
                console.log(itemEl.style.top)
                fieldList.addcoord(item, itemEl.style.left, itemEl.style.top)

            }
            itemEl.ondragstart = function() {
                return false;
            };

        }





        // itemEl.addEventListener('dragstart', (event) => {
        //     draggable = event.currentTarget;
        // });
        // itemEl.addEventListener('dragover', event => {
        //    event.preventDefault();
        // });
        // itemEl.addEventListener('dragend', event => {
        //     draggable = null;
        // });
        // itemEl.addEventListener('drop', event => {
        //     event.preventDefault();
        //
        // })
        // commonDivEl.addEventListener('dragover', event => {
        //     event.preventDefault();
        //
        // });
        // commonDivEl.addEventListener('drop', event => {
        //     event.preventDefault();
        //
        // });

            const removeEl = itemEl.querySelector('[data-id=remove]');

        removeEl.addEventListener('click', (event) =>{
            fieldList.remove(item);
            rebuildTree(container, list);
        });

        itemEl.addEventListener('click', (event) => {

        })


        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        const inputTaskEl = document.createElement('input');
        const windowTaskListEl = document.createElement('div')
        const windowGroupEl = document.createElement('div')
        const addTaskBtn = document.createElement('button')
        addTaskBtn.textContent = 'add'
        closeBtn.addEventListener('click', (event) => {
            windowEl.classList.remove('show');
            showWindow = false;
            windowEl.removeChild(windowGroupEl);
        });
        windowEl.appendChild(closeBtn);
        windowEl.addEventListener('transitionend', event => {
            if ((event.propertyName === 'opacity' && !windowEl.classList.contains('show'))
                && (showWindow !== true)) {
                windowEl.parentElement.removeChild(windowEl);
            }
        })
        const spanFieldEl = itemEl.querySelector('[data-id="text"]')

        spanFieldEl.addEventListener('click', event => {
            if(showWindow !== true) {
                windowEl.classList.add('show');
                showWindow = true;
                document.body.appendChild(windowEl)
                windowEl.appendChild(windowGroupEl)
                windowGroupEl.appendChild(inputTaskEl);
                windowGroupEl.appendChild(addTaskBtn)
                windowGroupEl.appendChild(windowTaskListEl)
                addTaskBtn.addEventListener('click', event => {
                    const taskNameEl = inputTaskEl.value;
                    const nameFieldEl = spanFieldEl.textContent
                    const taskEl = new FieldTask(taskNameEl);
                    fieldList.addtask(nameFieldEl, taskEl)
                    rebuildTreeWindow(windowTaskListEl, fieldList, nameFieldEl)

                });
            }

            //const inputTaskEl = windowEl.createElement()

        });


        // itemEl.classList.add('show');
        container.appendChild(itemEl)

    }

}

function rebuildTreeWindow (container, list, namefield) {
    container.innerHTML = '';
    const index = list.storage.items.findIndex(item => item.name === namefield);
    const ulTaskEl = document.createElement('ul');
    ulTaskEl.className = "window__ul-list"
    container.appendChild(ulTaskEl);
    list.storage.items[index].fieldtasks.forEach(item => {
        const liTaskEl = document.createElement('li');
        liTaskEl.innerHTML = `<span>${item.nametask}</span>`
        ulTaskEl.appendChild(liTaskEl)
    })
}

function addField() {
    const nameFieldEl = nameFieldInput.value;
    const field = new Field(nameFieldEl, 0);
    fieldList.add(field);
    nameFieldInput.value = '';
    rebuildTree(divFields, fieldList)
}