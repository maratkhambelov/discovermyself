import {Field, FieldList, FieldTask} from './lib.js';
import {LocalStorage} from './storage.js';

const divBySelfEl = document.querySelector('#div_byself');
const commonDivEl = document.querySelector('#commondiv_group');
const nameFieldInput = document.querySelector('#name_field');
const addBtnEl = document.querySelector('#addbtn');
const divFields = document.querySelector('#div_fields');
const changeModeEl = document.querySelector('#changemode')
const header = document.querySelector('.header');
let draggable = null;
let draggingLi = null;
const headerSpanInfo = document.querySelector('.header__span-info');
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
changeModeEl.addEventListener('click', (event) => {
    if(moveMode === false ) {
        moveMode = true

    } else {
        moveMode = false
        removeZone.style.visibility = "hidden"
    }
    rebuildTree(commonDivEl, fieldList)

});
// создание дерева для сфер жизни
function rebuildTree(container, list) {

    container.innerHTML = '';
    const commonDivElinTree = document.querySelector('#commondiv_group');
    for (const item of list.items) {
        const itemEl = document.createElement('div');
        itemEl.className = "div__field";
        itemEl.classList.add('content__circle');
        itemEl.innerHTML = `
        <span data-id="text" class="span__title">${item.name}</span>
        <div class="slider-wrapper">
        <span id="ratingspan" class="span__rating">${item.rating}</span>
        <input data-id="indicrate" 
        class="input__range-indic"
        type="range"
        min="0"
        max="10"
        step="0.5"
        value="${item.rating}"></input>
        </div>
        <button data-id="remove" class="btn__remove">X</button>`
        ratingAddColor(item.rating, itemEl)
        const spanTitleEl = itemEl.querySelector('.span__title');


        itemEl.style.position = 'absolute';
        itemEl.style.top = item.top;
        itemEl.style.left = item.left;




        const ratingIndEl = itemEl.querySelector('[data-id="indicrate"]');
        ratingIndEl.addEventListener('input', (event) => {
            let changeRatingDOM =  setTimeout( () => {
                const rating = ratingIndEl.value;
                let ratingSpanEl = itemEl.querySelector('#ratingspan')
                ratingSpanEl.textContent = rating
                fieldList.changerating(item, rating)

                ratingAddColor(rating, itemEl);

            }, 85)

            // setTimeout(changeRatingDOM(ratingSpanEl, rating), 5500)
        });


        const removeEl = itemEl.querySelector('[data-id=remove]');
        removeEl.addEventListener('click', (event) =>{
            fieldList.remove(item);

            rebuildTree(container, list);
        });


        const windowEl = document.createElement('div');
        windowEl.id = "window_tasks"
        windowEl.className = 'window';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.classList.add('btn', 'closewindow', 'btn-primary', 'btn-sm');
        const windowSpanInfo = document.createElement('span');
        windowSpanInfo.classList.add('window__span-info');

        const inputTaskEl = document.createElement('input');
        inputTaskEl.classList.add('window__input-task')
        const windowTaskListEl = document.createElement('div')
        windowTaskListEl.classList.add('window__wrap-ultasks')
        const windowGroupEl = document.createElement('div')
        windowGroupEl.classList.add('window__wrap-items');
        const addTaskBtn = document.createElement('button')
        addTaskBtn.textContent = 'Добавить'
        addTaskBtn.classList.add('btn', 'window__btn-addtask', 'btn-primary', 'btn-sm');
        closeBtn.addEventListener('click', (event) => {
            windowEl.classList.remove('show');
            showWindow = false;
            // windowEl.removeChild(windowGroupEl); // убрал, так как оно вроде не используется
        });
        document.body.addEventListener('keydown', (event) => {
            if(event.key === 'Escape') {
                windowEl.classList.remove('show');
                showWindow = false;
                // windowEl.removeChild(windowGroupEl); // убрал, так как оно вроде не используется
            }
        });


        windowEl.appendChild(closeBtn);
        windowEl.addEventListener('transitionend', event => {
            if ((event.propertyName === 'opacity' && !windowEl.classList.contains('show'))
                && (showWindow !== true)) {
                windowEl.parentElement.removeChild(windowEl);
            }
        })

        const fieldNameWindow = document.createElement('span')
        const spanFieldEl = itemEl.querySelector('[data-id="text"]')

        spanFieldEl.addEventListener('click', event => {
            const firstWindow = document.querySelector('#window_tasks');
            if(document.body.contains(firstWindow)) {
                document.body.removeChild(firstWindow)
            }
            if(showWindow !== true && moveMode != true) {
                fieldNameWindow.innerHTML = ''
                windowEl.classList.add('show');
                fieldNameWindow.textContent = event.currentTarget.textContent;
                fieldNameWindow.id = 'fieldnamewindow';
                // addTaskBtn.addEventListener('click', event => {
                //     const nameFieldEl = fieldNameWindow.textContent
                //     const taskNameEl = inputTaskEl.value;
                //
                //     if(taskNameEl === '') {
                //         windowSpanInfo.textContent = '';
                //         windowSpanInfo.textContent = 'Введите название задания';
                //         return;
                //     }
                //
                //     const taskEl = new FieldTask(taskNameEl);
                //     fieldList.addtask(nameFieldEl, taskEl);
                //     console.error(taskEl);
                //     rebuildTreeWindow(windowTaskListEl, fieldList, nameFieldEl)
                // });

                document.body.appendChild(windowEl)
                windowEl.appendChild(windowGroupEl)
                windowGroupEl.appendChild(windowSpanInfo)
                windowGroupEl.appendChild(inputTaskEl);
                windowGroupEl.appendChild(addTaskBtn)
                windowGroupEl.appendChild(fieldNameWindow)

                windowGroupEl.appendChild(windowTaskListEl)
                const nameFieldEl = spanFieldEl.textContent // возможно ошибка, здесь дублер

                rebuildTreeWindow(windowTaskListEl, fieldList, nameFieldEl) // возможно ошибка

                }



        });

        addTaskBtn.addEventListener('click', event => {
            const nameFieldEl = fieldNameWindow.textContent
            addTask();
            rebuildTreeWindow(windowTaskListEl, fieldList, nameFieldEl);
            inputTaskEl.value = '';
        });
        inputTaskEl.addEventListener('keydown', (event) => {
            if(event.key === 'Enter') {
                const nameFieldEl = fieldNameWindow.textContent
                addTask();
                rebuildTreeWindow(windowTaskListEl, fieldList, nameFieldEl);
                event.currentTarget.value = '';
            }
        });
        function addTask() {
            const nameFieldEl = fieldNameWindow.textContent
            const taskNameEl = inputTaskEl.value;
            if(taskNameEl === '') {
                windowSpanInfo.textContent = '';
                windowSpanInfo.textContent = 'Введите название задания';
                return;
            }
            const taskEl = new FieldTask(taskNameEl);
            fieldList.addtask(nameFieldEl, taskEl);
        }

        container.appendChild(itemEl)
        if(moveMode === true) {

            itemEl.style.wordBreak = "break-all"
            spanTitleEl.style.fontSize = "0.8em"
            spanTitleEl.style.textAlign = "center";
            spanTitleEl.style.marginTop = "4px"
            spanTitleEl.style.cursor = "move";
            spanTitleEl.style.fontWeight = "bold";

            itemEl.style.cursor = "move"
            const el = itemEl.querySelector('.slider-wrapper');
            el.style.visibility = "hidden"
            removeEl.style.visibility = "hidden"; //УБРАЛ НА ВРЕМЯ
            removeZone.style.visibility = "visible"
            itemEl.style.height= "50px";
            itemEl.style.width = "50px";

            itemEl.onmousedown = function (e) {

                let draggableField = e.currentTarget
                let coords = getCoords(draggableField);
                let shiftX = e.pageX - coords.left;
                let shiftY = e.pageY - coords.top;
                draggableField.style.position = 'absolute';
                moveAt(e);

                function moveAt(event) {
                    draggableField.style.left = event.pageX - shiftX + 'px';
                    draggableField.style.top = event.pageY - shiftY + 'px';
                }

                document.onmousemove = function (e) {
                    moveAt(e);
                };

                draggableField.onmouseup = function () {


                    fieldList.addcoord(item, draggableField.style.left, draggableField.style.top)

                    const imgTrash = document.querySelector('.trashimg');


                    let coordsTrash = getCoords(removeZone);
                    let coordField = getCoords(draggableField);


                    let widthTrashMax = coordsTrash.top + imgTrash.width;
                    let heightTrashMax = coordsTrash.left + imgTrash.height;
                    let widthTrash = coordsTrash.top;
                    let heightTrash = coordsTrash.left;

                    if((coordField.top > widthTrash && coordField.left > heightTrash)
                        && (coordField.top < widthTrashMax && coordField.left < heightTrashMax)) {
                        commonDivEl.removeChild(draggableField);
                        fieldList.remove(item);
                    }
                    document.onmousemove = null;
                    draggableField.onmouseup = null

                }

                draggableField.ondragstart = function () {
                    return false;
                }

            }


            function getCoords(elem) {
                let box = elem.getBoundingClientRect();

                return {
                    top: box.top + pageYOffset, //причина проблемы возможно
                    left: box.left + pageXOffset
                };
            }



        }

    }

}

//персобирает DOM дерево внутри модального окна

function rebuildTreeWindow (container, list, namefield) {
    container.innerHTML = '';
    const index = list.storage.items.findIndex(item => item.name === namefield);
    const ulTaskEl = document.createElement('ul');
    ulTaskEl.className = "window__ul-list"
    container.appendChild(ulTaskEl);

    list.storage.items[index].fieldtasks.forEach(item => {
        const nameFieldInWindow = document.createElement('span');
        nameFieldInWindow.textContent = `${list.storage.items[index]}`
        const liTaskEl = document.createElement('li');
        console.log(index)
        liTaskEl.innerHTML = `<span>${item.nametask}</span>
         <button data-id="removetask" class="btn__task-remove btn-outline-danger btn-sm">X</button>`;

        const removeTaskEl = liTaskEl.querySelector('[data-id=removetask]');
        removeTaskEl.style.cursor = "pointer";
        removeTaskEl.addEventListener('click', (event) =>{
            fieldList.removetask(index, item);
            ulTaskEl.removeChild(liTaskEl)
        });


        liTaskEl.className = 'window__li'
        liTaskEl.draggable = true;


        // работа с dragNdrop внутри окна в ul

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
                target.style['border-top'] = 'dashed 4px red';
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
        document.addEventListener('drop', function (e) {
            e.preventDefault();
            let target = getLi(e.target);

            if( target.style['border-bottom'] !== '' ) {
                target.style['border-bottom'] = '';
                const nameFieldToShow = document.querySelector('#fieldnamewindow')
                console.log(nameFieldToShow.textContent)
                console.log(draggingLi.textContent)
                console.log(e.target.nextSibling.textContent)
                //TODO: проверка if e.target.nextSibling != null
                fieldList.childrenreplace(draggingLi.textContent, e.target.nextSibling.textContent, nameFieldToShow.textContent)
                target.parentNode.insertBefore(draggingLi, e.target.nextSibling);
            } else if( target.style['border-top'] !== '' ){
                target.style['border-top'] = '';
                const nameFieldToShow = document.querySelector('#fieldtoshow')
                fieldList.childrenreplace(draggingLi.textContent, e.target.textContent, nameFieldToShow.textContent)
                target.parentNode.insertBefore(draggingLi, e.target);

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

function ratingAddColor(rating, item) {
    if(rating <= 10 && rating >= 6.5) {
        item.style.backgroundColor = "#00ff11";
        item.style.color = "white"

    } else if (rating <= 6.5 && rating >= 4.0) {
        item.style.backgroundColor = "#fffe3c";
        item.style.color = "black"
    } else if (rating <= 3.5 && rating >= 0) {
        item.style.backgroundColor = "#a40f1d";
        item.style.color = "white"

    }
}
