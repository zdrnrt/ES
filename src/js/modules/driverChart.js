

const data = {
    "Ассортимент": { sales: 141348.03947180862, norm: 161649.36087550133, stores: 1194 },
    "Оборудование ХО": { sales: 102349.559738584, norm: 117555.93670787, stores: 239 },
    "Выкладка на ХП": { sales: 84467.20848976781, norm: 95290.38078650815, stores: 1092 },
    "Выкладка на ТП": { sales: 43875.0315196673, norm: 49705.4615542462, stores: 1100 },
    "Цена": { sales: 9706.03947180862, norm: 10490.36087550133, stores: 143 },
    "ДМП": { sales: 7628.73549677048, norm: 8186.9994459773, stores: 245 }
};

let myChartDriver;

window.updateChartDriver = function () {
    const draiverTypes = document.getElementById('draiver_types').value;
    let labels = [];
    let salesData = [];
    let normData = [];
    let totalSales = 0;
    let totalNorm = 0;
    let totalStores = 0; // Переменная для хранения суммы всех stores

    if (draiverTypes === "Все") {
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
        labels.push(draiverTypes);
        salesData.push(data[draiverTypes].sales);
        normData.push(data[draiverTypes].norm);
        totalSales = data[draiverTypes].sales;
        totalNorm = data[draiverTypes].norm;
        totalStores = data[draiverTypes].stores; // Берем stores для выбранного формата
    }

    if (myChartDriver) {
        myChartDriver.destroy();
    }

    const ctx = document.getElementById('salesChartDraiver').getContext('2d');
    myChartDriver = new Chart(ctx, {
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
                    label: 'Прирост',
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
                    text: 'План прироста по драйверам', // Название графика
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
    document.getElementById('potentialSalesDraiver').innerText = `${potentialSales}`;

    // Выводим общую сумму stores в контейнер normingQuantityStores
    document.getElementById('draiverQuantityStoresDraiver').innerText = `${totalStores}`;

    // Показываем блок norming_containerBottom
    document.getElementById('draiver_containerBottom-wrapper').style.display = 'block';
};