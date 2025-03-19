

const data = {
    "Конвиниенс": { sales: 141348.03947180862, norm: 161649.36087550133, stores: 1494 },
    "Алкомаркеты": { sales: 102349.559738584, norm: 117555.93670787, stores: 939 },
    "Торговля через прилавок": { sales: 84467.20848976781, norm: 95290.38078650815, stores: 1892 },
"Бирбутики": { sales: 43875.0315196673, norm: 49705.4615542462, stores: 815 },
    "Гипермаркеты": { sales: 9706.03947180862, norm: 10490.36087550133, stores: 43 },
    "Ресторан": { sales: 7628.73549677048, norm: 8186.9994459773, stores: 245 },
    "Супермаркеты": { sales: 1802.534153507743, norm: 2624.56686710316, stores: 87 },
    "Дискаунтеры": { sales: 2498.59549677048, norm: 3035.5894459773, stores: 39 },
    "Киоски": { sales: 1376.20425947434, norm: 1556.20701538227, stores: 135 },
    "Вендинг": { sales: 596.20425947434, norm: 665.20701538227, stores: 45 }
};

let myChart;

window.updateChartNorm = function() {
    const selectedFormat = document.getElementById('formatSelectNorm').value;
    let labels = [];
    let salesData = [];
    let normData = [];
    let totalSales = 0;
    let totalNorm = 0;
    let totalStores = 0; // Переменная для хранения суммы всех stores

    if (selectedFormat === "Все") {
        // Если выбрано "Все", добавляем данные для всех форматов
        for (const format in data) {
            labels.push(format);
            salesData.push(data[format].sales);
            normData.push(data[format].norm);
            totalSales += data[format].sales;
            totalNorm += data[format].norm;
            totalStores += data[format].stores; // Суммируем stores для всех форматов
        }
    } else {
        // Если выбран конкретный формат, добавляем данные только для него
        labels.push(selectedFormat);
        salesData.push(data[selectedFormat].sales);
        normData.push(data[selectedFormat].norm);
        totalSales = data[selectedFormat].sales;
        totalNorm = data[selectedFormat].norm;
        totalStores = data[selectedFormat].stores; // Берем stores для выбранного формата
    }

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('salesChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar', // Используем тип 'bar'
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Продажи',
                    data: salesData,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Нормы',
                    data: normData,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y', // Делаем столбцы горизонтальными
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Факт и норма продаж', // Название графика
                    font: {
                        size: 16
                    }
                }
            },
            responsive: false, // Отключаем адаптивность графика
            maintainAspectRatio: false // Отключаем сохранение пропорций
        }
    });

    const potentialSales = (((totalNorm - totalSales) / totalSales) * 100).toFixed(1) + '%';
    document.getElementById('potentialSales').innerText = `${potentialSales}`;

    // Выводим общую сумму stores в контейнер normingQuantityStores
    document.getElementById('normingQuantityStores').innerText = `${totalStores}`;

    // Показываем блок norming_containerBottom
    document.getElementById('norming_containerBottom-wrapper').style.display = 'block';
};