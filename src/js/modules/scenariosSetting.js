import { moduleOpen } from '../tools'


window.scenariosSettingOpen = function() {
    moduleOpen('./src/html/scenariosSetting.html')
    .then( () => {
        scenariosSettingInit()
    });
}

// scenariosSettingOpen();

function scenariosSettingInit() {
    for (const form of document.querySelectorAll('.scenariosForm')){
        form.addEventListener('submit', scenariosSettingFormSubmit);
    }
    for (const btn of document.querySelectorAll('.scenariosForm__edit')){
        btn.addEventListener('click', scenariosSettingFormEdit);
    }
    for (const btn of document.querySelectorAll('[data-id="add"]')){
        btn.addEventListener('click', scenariosSettingAdd);
    }
    
}

function scenariosSettingFormSubmit(event){
    event.preventDefault();
}

function scenariosSettingFormEdit(event){
    const form = event.target.closest('.scenariosForm');
    form.classList.toggle('scenariosForm--edit');
}

function scenariosSettingAdd(event){
    const form = event.target.closest('.modal-body');
    const filter = form.querySelector('[data-id="filter"]').cloneNode(true);
    const list = form.querySelector('[data-id="list"]');
    filter.querySelector('[data-id="order"]').textContent = list.querySelectorAll('[data-id="filter"]').length + 1;
    list.append(filter);
}