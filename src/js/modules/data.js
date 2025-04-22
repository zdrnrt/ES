import { Modal } from "bootstrap/dist/js/bootstrap.min";
window.dataOpen = function () {
    fetch('./src/html/data.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Реакция сети: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            // Вставляем загруженный HTML в #content
            document.getElementById('content').innerHTML = html;
            dataInfoSpeedDraw();
            initializeScriptsAfterContentLoad();
        })
        .catch(error => {
            console.error('Возникла проблема с операцией выборки:', error);
        });
}


window.dataInfoSpeedDraw = function () {
    // Конфигурации для каждого графика
    const chartsConfig = [
        {
            id: "dataInfoOlap",
            value: 65,
            activeColor: "#474BAB",
            inactiveColor: "#cdd5e1",
            label: "ЕГАИС"
        },
        {
            id: "dataInfoAuto",
            value: 78,
            activeColor: "#474BAB",
            inactiveColor: "#cdd5e1",
            label: "BigData"
        },
        {
            id: "dataInfoForecast",
            value: 42,
            activeColor: "#474BAB",
            inactiveColor: "#cdd5e1",
            label: "Мониторинги"
        },
        {
            id: "dataInfoDistr",
            value: 91,
            activeColor: "#474BAB",
            inactiveColor: "#cdd5e1",
            label: "Дистрибьюторы"
        },
        {
            id: "dataInfoTraf",
            value: 55,
            activeColor: "#474BAB",
            inactiveColor: "#cdd5e1",
            label: "Трафик"
        }
    ];

    // Создаем каждый график с индивидуальными настройками
    chartsConfig.forEach(configItem => {
        const ctx = document.getElementById(configItem.id).getContext("2d");

        // Создаем элемент для отображения процента
        const percentageElement = document.createElement('div');
        percentageElement.className = 'text-center fw-bold mt-2';
        percentageElement.style.fontSize = '1.5rem';
        percentageElement.style.color = configItem.activeColor;
        percentageElement.textContent = `${configItem.value}%`;

        // Добавляем элемент под canvas
        ctx.canvas.insertAdjacentElement('afterend', percentageElement);

        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Active", "Inactive"],
                datasets: [{
                    data: [configItem.value, 100 - configItem.value],
                    backgroundColor: [configItem.activeColor, configItem.inactiveColor],
                    borderColor: [configItem.activeColor, configItem.inactiveColor],
                    borderWidth: 1,
                    cutout: "75%",
                    circumference: 180,
                    rotation: -90
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    //  текст в центр графика 
                    doughnutCenterText: {
                        text: `${configItem.value}%`,
                        color: configItem.activeColor,
                        fontStyle: 'bold'
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            // Плагин для отображения текста в центре
            // plugins: [{
            //     id: 'doughnutCenterText',
            //     beforeDraw(chart) {
            //         if (chart.config.options.plugins.doughnutCenterText) {
            //             const { text, color, fontStyle } = chart.config.options.plugins.doughnutCenterText;
            //             const { ctx } = chart;
            //             const { width, height } = chart;

            //             ctx.restore();
            //             ctx.font = `bold ${Math.min(width, height) / 4}px Arial`;
            //             ctx.textBaseline = 'middle';
            //             ctx.fillStyle = color;

            //             const textX = Math.round((width - ctx.measureText(text).width) / 2);
            //             const textY = height / 2;

            //             ctx.fillText(text, textX, textY);
            //             ctx.save();
            //         }
            //     }
            // }]
        });
    });
};



window.initializeScriptsAfterContentLoad = function () {
    // Убедимся, что таблица существует в DOM
    const tableBody = document.querySelector('#dataTable tbody');
    if (!tableBody) {
        console.error('Элемент #dataTable tbody не найден!');
        return;
    }

    // Загружаем CSV-файл
    //   loadCSVFromURL('./public/images/demo_file/control_data.csv');
    // https://github.com/Kujavia/ES/blob/master/public/images/demo_file/control_data.csv
    loadCSVFromURL('https://raw.githubusercontent.com/Kujavia/ES/master/public/images/demo_file/control_data.csv');

    // Инициализируем другие скрипты, если необходимо
    // Например, добавьте здесь вызовы других функций, которые зависят от загруженного контента
}

window.dataFilter = function (event) {
    event.preventDefault();
    const form = event.target;
    const result = new FormData(form);
    console.log(result);
}

window.showmodalDataControl = function (title) {
    const modalDataControl = document.getElementById('modalDataControl');
    const modalDataControlText = document.getElementById('modalDataControl-text');
    modalDataControlText.textContent = `Обновление: ${title}`;
    modalDataControl.style.display = 'flex';
    setTimeout(() => {
        modalDataControl.style.display = 'none';
    }, 3000);
}

window.getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.loadCSVFromURL = function (url) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
            const rows = text.split('\n');
            const tableBody = document.querySelector('#dataTable tbody');
            tableBody.innerHTML = '';

            rows.forEach((row, index) => {
                if (index === 0) return; // Пропускаем заголовок

                const columns = row.split(';');
                if (columns.length < 7) return;

                const tr = document.createElement('tr');

                columns.slice(0, 6).forEach(col => {
                    const td = document.createElement('td');
                    td.textContent = col.trim();
                    tr.appendChild(td);
                });

                // Рассчитываем процент
                const fact = parseInt(columns[4].trim()) || 0;
                const target = parseInt(columns[5].trim()) || 1;
                const percentage = ((fact / target) * 100).toFixed(2);
                const percentTd = document.createElement('td');
                percentTd.textContent = `${percentage}%`;
                if (percentage < 90) {
                    percentTd.classList.add('low-percentage');
                }
                tr.appendChild(percentTd);

                // Добавляем кнопку обновления
                const buttonDataControlTd = document.createElement('td');
                const buttonDataControl = document.createElement('buttonDataControl');
                buttonDataControl.textContent = 'Обновить';
                buttonDataControl.addEventListener('click', function () {
                    showmodalDataControl(columns[1].trim());
                    setTimeout(() => {
                        tr.children[3].textContent = new Date().toLocaleString();
                        const newFact = getRandomNumber(10000, 20000);
                        tr.children[4].textContent = newFact;
                        const newPercentage = ((newFact / target) * 100).toFixed(2);
                        percentTd.textContent = `${newPercentage}%`;
                        if (newPercentage < 90) {
                            percentTd.classList.add('low-percentage');
                        } else {
                            percentTd.classList.remove('low-percentage');
                        }
                    }, 3000);
                });
                buttonDataControlTd.appendChild(buttonDataControl);
                tr.appendChild(buttonDataControlTd);

                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Ошибка загрузки CSV:', error));
}

window.downloadTable1 = function () {
    // Ссылка на файл для загрузки
    const fileUrl = './public/images/demo_file/control_data.csv'; // Замените на реальную ссылку

    // Создаём временный элемент <a> для загрузки
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'table.csv'; // Имя файла, которое будет предложено пользователю
    document.body.appendChild(link); // Добавляем элемент в DOM
    link.click(); // Программно кликаем по ссылке
    document.body.removeChild(link); // Удаляем элемент из DOM
}