import {Field, FieldList} from './lib.js';
import {LocalStorage} from './storage.js';

const divBySelfEl = document.querySelector('#div_byself');
const commonDivEl = document.querySelector('#commondiv_group');
const nameFieldInput = document.querySelector('#name_field');
const addBtnEl = document.querySelector('#addbtn');
const divFields = document.querySelector('#div_fields');

const fieldList = new FieldList(new LocalStorage());
rebuildTree(divFields, fieldList)

addBtnEl.addEventListener('click', (event) => {
    const nameFieldEl = nameFieldInput.value;
    const field = new Field(nameFieldEl);
    fieldList.add(field);
    nameFieldInput.value = '';
    rebuildTree(divFields, fieldList)
});

function rebuildTree(container, list) {
    container.innerHTML = '';
    for (const item of list.items) {
        const itemEl = document.createElement('div');
        itemEl.className = "div__field"
        itemEl.innerHTML = `<span data-id="text">${item.name}</span>`
        container.appendChild(itemEl)

    }

}