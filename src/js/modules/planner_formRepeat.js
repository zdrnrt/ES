function planner_selectScenarioRepeat() {
    closeAllModals(); // Закрыть все мокна 
        document.getElementById('planner_weeklyModal').style.display = 'block';
        const intervalSelect = document.getElementById('planner_intervalRepetition__header');
        const dayOfWeekParagraph = document.querySelector('.planner_visionParagraphDayOfWeek');
        const dayOfWeekSelect = document.getElementById('planner_dayOfWeekRepeat');
        const intervalWrapperDay = document.querySelector('.planner_intervalWrapperDay');
        const dayAndWeekMonth = document.getElementById('dayAndWeekMonth');  
        const planner_dayNumber = document.getElementById('planner_dayNumber'); 
        planner_dayNumber.style.display = 'none';
        dayAndWeekMonth.style.display = 'none';
        dayOfWeekParagraph.style.display = 'none';
        dayOfWeekSelect.style.display = 'none';
 
}
// function planner_selectScenarioRepeat() {
//     const select = document.getElementById('planner__scenarioRepeat');
//     const value = select.value;

//     closeAllModals(); // Закрыть все мокна 

//     if (value === 'week') {
//         document.getElementById('planner_weeklyModal').style.display = 'block';
//     } else if (value === 'day') {
//         document.getElementById('timeModal').style.display = 'block';
//     } else if (value === 'month') {
//         document.getElementById('checkboxModal').style.display = 'block';
//     }
// }

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function closeAllModals() {
    closeModal('planner_weeklyModal');
    closeModal('timeModal');
    closeModal('checkboxModal');
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeAllModals();
    }
}

function saveSettings() {
    const nameProject = document.getElementById('planner__scenarioName').value;
    const plannerBlock= document.getElementById('planner__block');
    const selectedplannerBlock = plannerBlock.options[plannerBlock.selectedIndex].text;

    const plannerScenarioCustom = document.getElementById('planner__scenarioCustom');
    const selectedplannerScenarioCustom = plannerScenarioCustom.options[plannerScenarioCustom.selectedIndex].text;
    const plannerInterval = document.getElementById('planner_interval').value;
    // const plannerScenarioRepeat = document.getElementById('planner__scenarioRepeat');
    // const selectedplannerScenarioRepeat = plannerScenarioRepeat.options[plannerScenarioRepeat.selectedIndex].text;
    // const day = document.getElementById('planner_dayOfWeekRepeat').value;
    const time = document.getElementById('planner_selectedTime').value;
    const startDate = document.getElementById('planner_selectedStartDate').value;
    const endDate = document.getElementById('planner_selectedEndDate').value;
    const planner_intervalRepetition__header = document.getElementById('planner_intervalRepetition__header').value;
    const monthlyRepeatSelect = document.getElementById('planner_dayNumber').value;
    
    console.log()
    
    const resultFrame = document.getElementById('planner_Iframe');
    const frameDocument = resultFrame.contentDocument || resultFrame.contentWindow.document;

    frameDocument.body.innerHTML = 
        `        <style>
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-family: Arial, sans-serif;
            }
            th, td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }
            tr:hover {
                background-color: #f5f5f5;
            }
        </style>
        <h3>Выбранные значения:</h3>
        <table>
            <tr>
                <th>Наименование</th>
                <th>Блок</th>
                <th>Сценарий</th>
                <th>Период повторений</th>
                <th>Интервал повторений</th>
                <th>Дата начала</th>
                <th>Дата окончания</th>
                <th>Время</th>
            </tr>
            <tr>
                <td>${nameProject}</td>
                <td>${selectedplannerBlock}</td>
                <td>${selectedplannerScenarioCustom}</td>
                <td>${planner_intervalRepetition__header}</td>
                <td>${plannerInterval} дней</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>${time}</td>
            </tr>
        </table>`
    ;
    // Закрываем модальное окно
    closeModal('planner_weeklyModal');
}



export { saveSettings, planner_selectScenarioRepeat, closeModal, closeAllModals };

window.planner_selectScenarioRepeat = planner_selectScenarioRepeat;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.saveSettings = saveSettings;