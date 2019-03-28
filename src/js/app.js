import {Field, FieldList, FieldTask} from './lib.js';
import {LocalStorage} from './storage.js';

const divBySelfEl = document.querySelector('#div_byself');
const commonDivEl = document.querySelector('#commondiv_group');
const nameFieldInput = document.querySelector('#name_field');
const addBtnEl = document.querySelector('#addbtn');
const divFields = document.querySelector('#div_fields');
let draggable = null;
let draggingLi = null;
const removeZone = document.querySelector('#removezone');
let moveMode = false;

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



        if(moveMode === true) {
            itemEl.style.position = 'absolute';
            itemEl.style.left = item.coordx;
            itemEl.style.top = item.coordy;

            itemEl.onmousedown = function(e) {
                let coords = getCoords(itemEl);
                let shiftX = e.pageX - coords.left;
                let shiftY = e.pageY - coords.top;
                moveAt(e);
                itemEl.style.position = 'absolute';
                document.body.appendChild(itemEl);

                // commonDivEl.appendChild(itemEl); // TODO: мб ошибка тут!
                function moveAt (e) {
                    itemEl.style.left = e.pageX - shiftX + 'px';
                    itemEl.style.top = e.pageY - shiftY + 'px';

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

                function getCoords(elem) {
                    let box = elem.getBoundingClientRect();
                    return {
                        top: box.top + pageYOffset,
                        left: box.left + pageXOffset
                    };
                }

            }
        }






        itemEl.addEventListener('dragstart', (event) => {
            draggable = event.currentTarget;
        });
        itemEl.addEventListener('dragend', event => {
            draggable = null;
        });
        commonDivEl.addEventListener('dragover', event => {
           event.preventDefault();
        });




        removeZone.addEventListener('dragover', event => {
            event.preventDefault();


        });
        removeZone.addEventListener('drop', event => {
            event.preventDefault()
            console.dir(draggable)
            const nameField = draggable.firstElementChild.textContent
            console.log(nameField)
            fieldList.removebyname(nameField);
            commonDivEl.removeChild(draggable)
        });
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
        liTaskEl.className = 'window__li'
        liTaskEl.draggable = true;
        document.addEventListener('dragstart', function(event) {
            let target = getLi(event.target);
            draggingLi = target;
            draggingLi.style.opacity = "0.4"
            event.dataTransfer.setData('text/plain', null);
            // event.dataTransfer.setDragImage(self.dragging,0,0); //не знаю зачем это нужно
        });
        document.addEventListener('dragover', function (event) {
            event.preventDefault();
            let target = getLi(event.target);
            let bounding = target.getBoundingClientRect();
            let offset = bounding.y + (bounding.height/2);
            if( event.clientY - offset > 0 ) {
                target.style['border-bottom'] = 'dashed 4px blue';
                target.style['border-top'] = '';
            } else {
                target.style['border-top'] = 'dashed 4px blue';
                target.style['border-bottom'] = '';
            }
        });
        document.addEventListener('dragend', function (event) {
            let target = getLi(event.target);
            draggingLi.style.opacity = "1"
        });
        document.addEventListener('dragleave', function (event) {

            let target = getLi(event.target);
            target.style['border-bottom'] = '';
            target.style['border-top'] = '';
        });
        document.addEventListener('drop', function (event) {
            event.preventDefault();
            console.log(event.target)
            let target = getLi(event.target);
            if( target.style['border-bottom'] !== '' ) {
                target.style['border-bottom'] = '';
                target.parentNode.insertBefore(draggingLi, event.target.nextSibling)
            } else {
                target.style['border-top'] = '';
                target.parentNode.insertBefore(draggingLi, event.target);
            }
        })

        function getLi(target) {
            while ( target.nodeName.toLowerCase() != 'li' && target.nodeName.toLowerCase() != 'body' ) {  //возможно ошибка
                target = target.parentNode;
            }
            if ( target.nodeName.toLowerCase() == 'body' ) {
                return false;
            } else {
                return target;
            }
        }
        ulTaskEl.appendChild(liTaskEl)

    })
}

function addField() {
    const nameFieldEl = nameFieldInput.value;
    const field = new Field(nameFieldEl, 0);
    fieldList.add(field);
    nameFieldInput.value = '';
    rebuildTree(commonDivEl, fieldList)
}