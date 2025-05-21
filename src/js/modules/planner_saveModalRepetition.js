let modalData = {};

function saveModalData() {
    modalData.intervalNum = document.getElementById('planner_intervalPeriodicity').value;
    modalData.dayOfWeekRepeat = document.getElementById('planner_dayOfWeekRepeat').options[document.getElementById('planner_dayOfWeekRepeat').selectedIndex].text;
    modalData.selectedTime = document.getElementById('planner_selectedTime').value;
    modalData.selectedStartDate = document.getElementById('planner_selectedStartDate').value;
    modalData.dayOfWeekMonthRepeat = document.getElementById('planner_dayNumber').options[document.getElementById('planner_dayNumber').selectedIndex].text;
    modalData.dayOfWeekMonthRepeatAttribute = document.getElementById('dayAndWeekMonth').options[document.getElementById('dayAndWeekMonth').selectedIndex].text;

    const endingOptions = document.querySelectorAll('input[name="options"]:checked');
    let endingInfo = '';
    endingOptions.forEach(option => {
        if (option.value === 'never') {
            endingInfo = 'Никогда';
        } else if (option.value === 'number') {
            const times = document.getElementById('planner_ModalRepetition__times').value;
            endingInfo = `Спустя ${times} раз`;
        } else if (option.value === 'date') {
            const endDate = document.getElementById('dateInput').value;
            endingInfo = `${endDate}`;
        }
    });

    modalData.endingInfo = endingInfo;
    closeModal('planner_weeklyModal');
}

function planner_addData() {
    const scenarioName = document.getElementById('planner__scenarioName').value;
    const block = document.getElementById('planner__block').options[document.getElementById('planner__block').selectedIndex].text;
    const scenarioCustom = document.getElementById('planner__scenarioCustom').options[document.getElementById('planner__scenarioCustom').selectedIndex].text;
    const planner_intervalRepetition__header = document.getElementById('planner_intervalRepetition__header').value;

    const planner_intervalRepetition__headerText = document.getElementById('planner_intervalRepetition__header').options[document.getElementById('planner_intervalRepetition__header').selectedIndex].text;

    let repetitionValueMonth = modalData.dayOfWeekRepeat;
    let repetitionValueMonthAttribute = modalData.dayOfWeekMonthRepeatAttribute
    if (planner_intervalRepetition__header === 'monthly') {
        repetitionValueMonth = `${modalData.dayOfWeekMonthRepeat} ${modalData.dayOfWeekMonthRepeatAttribute}`;
        console.log(modalData.dayOfWeekMonthRepeat)
    }


    const newRowHTML =
        `<tr>
            <td>${scenarioName}</td>
            <td>${block}</td>
            <td>${scenarioCustom}</td>
            <td>${planner_intervalRepetition__headerText}</td>
            <td>${modalData.intervalNum}</td>
            <td>${repetitionValueMonth}</td>
            <td>${modalData.selectedTime}</td>
            <td>${modalData.selectedStartDate}</td>
            <td>${modalData.endingInfo}</td>
        </tr>`
        ;

    const iframe = document.getElementById('planner_Iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Проверяем, существует ли таблица
    let table = iframeDoc.querySelector('table');

    if (!table) {
        // Если таблицы нет, создаём её
        const resultHTML = `
        <style>
            .table-container {
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #ddd; /* Добавляем границу для видимости скругления */
            }
            table { 
                width: 100%;
                border-collapse: collapse;
                font-family: Inter, sans-serif;
                font-size: 12px;
            }
            th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #F1F2FF;
            }
            tr:hover {
                background-color: #2C2D31;
            }
        </style>
        <div class="table-container">
            <table>
                <tr>
                    <th>Наименование</th>
                    <th>Блок</th>
                    <th>Сценарий</th>
                    <th>Период повторений</th>
                    <th>Интервал</th>
                    <th>Повторение</th>
                    <th>Время</th>
                    <th>Начало</th>
                    <th>Окончание</th>
                </tr>
                ${newRowHTML}
            </table>
        </div>
        `;
        iframeDoc.open();
        iframeDoc.write(resultHTML);
        iframeDoc.close();
    } else {
        // Если таблица существует, добавляем новую строку
        const tbody = table.querySelector('tbody') || table.createTBody();
        tbody.insertAdjacentHTML('beforeend', newRowHTML);
    }
}



export { saveModalData, planner_addData };

window.saveModalData = saveModalData;
window.planner_addData = planner_addData;

