import {Field, FieldList, FieldTask} from './lib.js';
import {LocalStorage} from './storage.js';

const divBySelfEl = document.querySelector('#div_byself');
const commonDivEl = document.querySelector('#commondiv_group');
const contentMain = document.querySelector('.content--main');
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
    let btn = event.currentTarget ;
    toDrag(btn)
    rebuildTree(commonDivEl, fieldList)

});

contentMain.addEventListener('dblclick', e => {
        toDrag(changeModeEl)
        rebuildTree(commonDivEl, fieldList);
});

function toDrag(btn) {
    if(moveMode === false && btn.textContent === "Переместить") {
        moveMode = true
        btn.textContent = "Отменить Перемещение";
    } else {
        moveMode = false
        btn.textContent = "Переместить";
        removeZone.style.visibility = "hidden";
    }
}
// создание дерева для сфер жизни
function rebuildTree(container, list, position) {

    container.innerHTML = '';

    const commonDivElinTree = document.querySelector('#commondiv_group');
    for (const item of list.items) {
        const itemEl = document.createElement('div');
        itemEl.className = "div__field";
        itemEl.classList.add('content__circle');
        itemEl.innerHTML = `
        <span id="ratingspan" class="span__rating">${item.rating}</span>
        <span data-id="text" class="span__title">${item.name}</span>
        <div class="slider-wrapper">
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

        itemEl.style.top = item.top;
        itemEl.style.left = item.left;
            if(item.top !== undefined || item.left !== undefined) {
                itemEl.style.position = 'absolute';
            }







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
        windowEl.style.borderRadius = "1%";
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.classList.add('btn', 'closewindow', 'btn-info', 'btn-sm');
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
        addTaskBtn.classList.add('btn', 'window__btn-addtask', 'btn-info', 'btn-sm');
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
        const windowRatingEl = document.createElement('span');
        const windowWrapSpan = document.createElement('div');
        const spanFieldEl = itemEl.querySelector('[data-id="text"]')

        spanFieldEl.addEventListener('click', event => {
            const firstWindow = document.querySelector('#window_tasks');
            if(document.body.contains(firstWindow)) {
                document.body.removeChild(firstWindow)
            }
            if(showWindow !== true && moveMode != true) {
                fieldNameWindow.innerHTML = ''
                windowEl.classList.add('show');
                windowWrapSpan.classList.add('window__wrap-span');
                windowWrapSpan.style.display = "flex";
                windowWrapSpan.style.flexDirection = "column";
                fieldNameWindow.textContent = event.currentTarget.textContent;
                fieldNameWindow.id = 'fieldnamewindow';
                windowRatingEl.classList.add('window__span-rating');
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
                windowWrapSpan.appendChild(fieldNameWindow);
                windowWrapSpan.appendChild(windowRatingEl);
                windowGroupEl.appendChild(windowWrapSpan)
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
            windowSpanInfo.textContent = '';
            const nameFieldEl = fieldNameWindow.textContent
            const taskNameEl = inputTaskEl.value;
            if(taskNameEl === '') {
                // windowSpanInfo.textContent = '';
                windowSpanInfo.textContent = 'Введите название задания';
                return;
            }
            const taskEl = new FieldTask(taskNameEl);
            const indexField = fieldList.storage.items.findIndex(i => i.name === nameFieldEl);
            console.log(fieldList.storage.items)
            console.log(fieldList.storage.items[indexField].fieldtasks)
            const uniqueItem = fieldList.storage.items[indexField].fieldtasks.find(i => i.nametask === taskNameEl);
            console.log(uniqueItem)
            if(uniqueItem === undefined) {
                fieldList.addtask(nameFieldEl, taskEl);
            } else {
                windowSpanInfo.textContent = "Такая задача уже добавлена ранее";
            }
        }

        container.appendChild(itemEl)
        if(moveMode === true) {

            spanTitleEl.style.fontSize = "0.9em"
            spanTitleEl.style.width = "70px";
            spanTitleEl.style.textAlign = "center";
            spanTitleEl.style.marginTop = "10px"
            spanTitleEl.style.wordWrap = "break-word"
            spanTitleEl.style.cursor = "move";
            spanTitleEl.style.fontWeight = "bold";

            itemEl.style.cursor = "move"
            const el = itemEl.querySelector('.slider-wrapper');
            el.style.visibility = "hidden"
            removeEl.style.visibility = "hidden"; //УБРАЛ НА ВРЕМЯ
            removeZone.style.visibility = "visible"

            itemEl.style.height= "90px";
            itemEl.style.width = "90px";


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
    const windowRatingEl = document.querySelector('.window__span-rating');

    const index = list.storage.items.findIndex(item => item.name === namefield);
    const ulTaskEl = document.createElement('ul');
    ulTaskEl.className = "window__ul-list"
    windowRatingEl.textContent = list.storage.items[index].rating;
    // windowRatingEl.style.
    container.appendChild(ulTaskEl);

    list.storage.items[index].fieldtasks.forEach(item => {
        const nameFieldInWindow = document.createElement('span');
        nameFieldInWindow.textContent = `${list.storage.items[index]}`
        const liTaskEl = document.createElement('li');
        liTaskEl.innerHTML = `<span>${item.nametask}</span>
         <div class="task__group-btn">
         <button data-id="done" class="btn__task-done btn-outline-success btn-sm task_btn">&#10003;</button>
         <button data-id="removetask" class="btn__task-remove btn-outline-danger btn-sm task_btn">X</button>
         </div>`;

        const removeTaskEl = liTaskEl.querySelector('[data-id=removetask]');
        removeTaskEl.addEventListener('click', (event) =>{
            fieldList.removetask(index, item);
            ulTaskEl.removeChild(liTaskEl)
        });
        const btnDone = liTaskEl.querySelector('[data-id=done]');
        if(item.done === true) {
            btnDone.style.visibility = 'hidden';
            liTaskEl.style.backgroundColor = 'rgba(192,192,192, 0.2)';
        }
        btnDone.addEventListener('click', event => {
            fieldList.changedone(index, item);
            // console.log(list.storage.items[index]);

            windowRatingEl.textContent = list.storage.items[index].rating
            rebuildTree(commonDivEl, fieldList);
            btnDone.style.visibility = 'hidden';
            liTaskEl.style.backgroundColor = 'rgba(192,192,192, 0.2)';

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
                target.style.borderBottom = 'solid 4px blue';
                // target.style.boxShadow = "5 5 12px gray";
                target.style.borderTop = '';
            } else {
                target.style.borderTop = 'solid 4px blue';
                // target.style.boxShadow = "0 0 10px gray";
                target.style.borderBottom = '';
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
                console.dir(draggingLi.firstElementChild.textContent)
                console.log(draggingLi.firstElementChild.textContent)
                console.dir(e.target.nextSibling)
                if(e.target.nextSibling !== null) {
                    fieldList.childrenreplace(draggingLi.firstElementChild.textContent, e.target.nextSibling.firstElementChild.textContent, nameFieldToShow.textContent)
                    target.parentNode.insertBefore(draggingLi, e.target.nextSibling);
                } else {
                    fieldList.childrenreplace(draggingLi.firstElementChild.textContent, draggingLi.firstElementChild.textContent, nameFieldToShow.textContent);
                    target.parentNode.appendChild(draggingLi);
                }
            } else if( target.style['border-top'] !== '' ){
                target.style['border-top'] = '';
                const nameFieldToShow = document.querySelector('#fieldnamewindow')
                fieldList.childrenreplace(draggingLi.firstElementChild.textContent, e.target.firstElementChild.textContent, nameFieldToShow.textContent)
                target.parentNode.insertBefore(draggingLi, e.target);

            }
        })

function getLi(target) {
    while ( target.nodeName.toLowerCase() != 'li' && target.nodeName.toLowerCase() != 'body' ) {
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
    const headerSpanInfo = document.querySelector('.header__span-info');
    headerSpanInfo.textContent = '';
    const nameFieldElNoSubstr = nameFieldInput.value;
    if(nameFieldElNoSubstr === '') {
        headerSpanInfo.textContent = 'Введите название сферы';
        return
    }
    const nameFieldEl = nameFieldElNoSubstr.substr(0,13)
    const field = new Field(nameFieldEl, 0);
    const uniqueItem = fieldList.storage.items.find(i => i.name === nameFieldEl)
    console.log(uniqueItem)
    if(uniqueItem === undefined) {
        fieldList.add(field);
    } else {
        headerSpanInfo.textContent = 'Такая сфера уже добавлена ранее'
    }

    nameFieldInput.value = '';
    rebuildTree(commonDivEl, fieldList, 'relative');
}

function ratingAddColor(rating, item) {
    if(rating <= 10 && rating >= 6.5) {
        item.style.backgroundColor = "#20c829";
        item.style.color = "white"

    } else if (rating <= 6.5 && rating >= 4.0) {
        item.style.backgroundColor = "#fffe3c";
        item.style.color = "black"
    } else if (rating <= 3.5 && rating >= 0) {
        item.style.backgroundColor = "#a40f1d";
        item.style.color = "white"

    }
}
