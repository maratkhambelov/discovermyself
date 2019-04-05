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
    console.log(moveMode)
    rebuildTree(commonDivEl, fieldList)

});

function rebuildTree(container, list) {

    container.innerHTML = '';
    const commonDivElinTree = document.querySelector('#commondiv_group');
    for (const item of list.items) {
        const itemEl = document.createElement('div');
        itemEl.className = "div__field"

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



                // switch(parseInt(rating)) {
                //     case rating < 10:
                //         itemEl.style.backgroundColor = "#00a431";
                //     case 5:
                //         itemEl.style.backgroundColor = "#cef41c";
                // }
            }, 150)

            // setTimeout(changeRatingDOM(ratingSpanEl, rating), 5500)
        });



        const removeEl = itemEl.querySelector('[data-id=remove]');
        removeEl.addEventListener('click', (event) =>{
            fieldList.remove(item);

            rebuildTree(container, list);
        });

        itemEl.addEventListener('click', (event) => {

        })


        const windowEl = document.createElement('div');
        windowEl.id = "window_tasks"
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

        const fieldToShowinTable = document.createElement('span')
        const spanFieldEl = itemEl.querySelector('[data-id="text"]')

        spanFieldEl.addEventListener('click', event => {
            const firstWindow = document.querySelector('#window_tasks');
            if(document.body.contains(firstWindow)) {
                document.body.removeChild(firstWindow)
            }
            if(showWindow !== true && moveMode != true) {
                fieldToShowinTable.innerHTML = ''
                windowEl.classList.add('show');
                fieldToShowinTable.textContent = event.currentTarget.textContent;
                fieldToShowinTable.id = 'fieldtoshow'

                document.body.appendChild(windowEl)
                windowEl.appendChild(windowGroupEl)
                windowGroupEl.appendChild(inputTaskEl);
                windowGroupEl.appendChild(addTaskBtn)
                windowGroupEl.appendChild(fieldToShowinTable)

                windowGroupEl.appendChild(windowTaskListEl)

                const nameFieldEl = spanFieldEl.textContent // возможно ошибка, здесь дублер

                rebuildTreeWindow(windowTaskListEl, fieldList, nameFieldEl, fieldToShowinTable) // возможно ошибка
                addTaskBtn.addEventListener('click', event => {
                    const nameFieldEl = spanFieldEl.textContent
                    const taskNameEl = inputTaskEl.value;
                    const taskEl = new FieldTask(taskNameEl);
                    fieldList.addtask(nameFieldEl, taskEl)
                    rebuildTreeWindow(windowTaskListEl, fieldList, nameFieldEl)
                });
            }

        });

        container.appendChild(itemEl)
        if(moveMode === true) {
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
                draggableField.style.zIndex = 100;

                function moveAt(event) {
                    draggableField.style.left = event.pageX - shiftX + 'px';
                    draggableField.style.top = event.pageY - shiftY + 'px';
                }

                document.onmousemove = function (e) {
                    moveAt(e);
                };

                draggableField.onmouseup = function () {


                    fieldList.addcoord(item, draggableField.style.left, draggableField.style.top)



                    let coordsTrash = getCoords(removeZone);
                    let coordField = getCoords(draggableField);
                    console.log(coordsTrash)
                    console.log(coordField)
                    console.log(coordField.bottom)
                    console.dir(removeZone)
                    let widthTrash = coordsTrash.top + removeZone.style.width;
                    console.log(widthTrash)
                    let heightTrash = coordsTrash.left + removeZone.style.height;
                    console.log(heightTrash)
                    if(coordField.top > heightTrash && coordField.left > widthTrash) {
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
        const indexOfTask =  list.storage.items[index]
        liTaskEl.innerHTML = `<span>${item.nametask}</span>`
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
                const nameFieldToShow = document.querySelector('#fieldtoshow')
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
        item.style.backgroundColor = "#00a45a";
    } else if (rating <= 6.5 && rating >= 4.0) {
        item.style.backgroundColor = "#a4a35e";
    } else if (rating <= 3.5 && rating >= 0) {
        item.style.backgroundColor = "#a40f1d";
    }
}





//
// liTaskEl.addEventListener('dragstart', function (e) {
//     // debugger
//     draggingLi = e.currentTarget;
//     // e.dataTransfer.effectAllowed = 'move';
//     e.dataTransfer.setData('text/html', this.outerHTML);
//     console.log(e)
//     this.classList.add('dragElem');
//     console.log(draggingLi)
//
// });
// liTaskEl.addEventListener('dragover', function (e) {
//     e.preventDefault();
//     // draggingLi.classList.add('over');
//
//     // e.dataTransfer.dropEffect = 'move';
// });
//
// liTaskEl.addEventListener('dragleave', function (e) {
//     // draggingLi.classList.remove('over');
//
// });
//
//
// liTaskEl.addEventListener('drop', function (e) {
//     if(draggingLi != this) {
//         console.log(draggingLi)
//
//         let dropHtml = e.dataTransfer.getData('text/html'); //то что будешь бросать
//         this.insertAdjacentHTML('beforebegin', dropHtml); // вставить элемент, на который бросает
//         // перед HTML элементом, который бросается oldChild before newChild
//         // this.parentNode.removeChild(
//         // );
//
//
//         // let dropElem = this.previousSibling; // предыдущий элемент, перед которым бросается
//     }
//     // this.classList.remove('over');
// });
// liTaskEl.addEventListener('dragend', function (e) {
//     // this.classList.remove('over');
// })


// document.addEventListener('dragstart', function(event) {
//     let target = getLi(event.target);
//     draggingLi = target;
//     draggingLi.style.opacity = "0.4"
//     event.dataTransfer.setData('text/plain', null);
//     // event.dataTransfer.setDragImage(self.dragging,0,0); //не знаю зачем это нужно
// });
// document.addEventListener('dragover', function (event) {
//     event.preventDefault();
//     let target = getLi(event.target);
//     let bounding = target.getBoundingClientRect();
//     let offset = bounding.y + (bounding.height/2);
//     if( event.clientY - offset > 0 ) {
//         target.style['border-bottom'] = 'dashed 4px blue';
//         target.style['border-top'] = '';
//     } else {
//         target.style['border-top'] = 'dashed 4px blue';
//         target.style['border-bottom'] = '';
//     }
// });
// document.addEventListener('dragend', function (event) {
//     let target = getLi(event.target);
//     draggingLi.style.opacity = "1"
// });
// document.addEventListener('dragleave', function (event) {
//
//     let target = getLi(event.target);
//     target.style['border-bottom'] = '';
//     target.style['border-top'] = '';
// });
// document.addEventListener('drop', function (event) {
//     event.preventDefault();
//     console.log(event.target)
//     let target = getLi(event.target);
//     if( target.style['border-bottom'] !== '' ) {
//         target.style['border-bottom'] = '';
//         target.parentNode.insertBefore(draggingLi, event.target.nextSibling)
//     } else {
//         target.style['border-top'] = '';
//         target.parentNode.insertBefore(draggingLi, event.target);
//     }
// })
//
// function getLi(target) {
//     while ( target.nodeName.toLowerCase() != 'li' && target.nodeName.toLowerCase() != 'body' ) {  //возможно ошибка
//         target = target.parentNode;
//     }
//     if ( target.nodeName.toLowerCase() == 'body' ) {
//         return false;
//     } else {
//         return target;
//     }
// }



/*
liTaskEl.addEventListener('dragstart', (event) => {
    draggingLi = event.currentTarget;
});
liTaskEl.addEventListener('dragend', event => {
    draggingLi = null;
});
liTaskEl.addEventListener('dragover', event => {
    event.preventDefault();
    let bounding = draggingLi.getBoundingClientRect();
    let offset = bounding.y + (bounding.height/2);
    if( event.clientY - offset > 0 ) {
        draggingLi.style['border-bottom'] = 'dashed 4px blue';
        draggingLi.style['border-top'] = '';
    } else {
        draggingLi.style['border-top'] = 'dashed 4px blue';
        draggingLi.style['border-bottom'] = '';
    }
});

liTaskEl.addEventListener('drop', event => {
    event.preventDefault();

    const parent = event.currentTarget.parentElement;
    const oldChild = event.currentTarget.nextElementSibling;
    const newChild = draggingLi;
    const oldChildSpan = draggingLi.nextElementSibling.querySelector('span');
    const newChildSpan = newChild.querySelector('span');

    parent.insertBefore(newChild, oldChild);
    // taskList.childrenreplace(newChildSpan.textContent, oldChildSpan.textContent)
})
*/
















// let dragItemCoords = null;
// itemEl.addEventListener('dragstart', (event) => {
//     draggable = event.currentTarget;
//
// });
//
// itemEl.addEventListener('dragover', (event) => {
//     event.preventDefault();
//
//
// })
// itemEl.addEventListener('dragend', event => {
//
//
//     // let dragItemCoordsData = event.dataTransfer.setData('html/plain', dragItemCoords)
//     // draggable = null;
//     // fieldList.addcoord(item)
//     //     itemEl.style.x, itemEl.style.y
// });
//
// commonDivElinTree.addEventListener('dragover', event => {
//     let dragItemCoords = event.currentTarget.getBoundingClientRect();
//     console.log(dragItemCoords)
//     event.preventDefault();
// });
// commonDivElinTree.addEventListener('drop', event => {
//    event.preventDefault();
// });










// itemEl.addEventListener('dragstart', e => {
//     draggable = e.currentTarget;
//     console.log('dragstart')
// });
// document.addEventListener('dragover', e => {
//     e.preventDefault();
//     console.log('dragover')
// })
// itemEl.addEventListener('drop', e => {
//     e.preventDefault();
// })
// itemEl.addEventListener('dragend', e => {
//     draggable = null;
// })
// removeZone.addEventListener('dragover', event => {
//     event.preventDefault();
//     console.log(draggable)
// });
// removeZone.addEventListener('drop', event => {
//     event.preventDefault()
//
//     console.dir(draggable)
//     const nameField = draggable.firstElementChild.textContent
//     console.log(nameField)
//     fieldList.removebyname(nameField);
//     commonDivEl.removeChild(draggable)
// });
