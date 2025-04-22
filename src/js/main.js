import * as XLSX from 'xlsx';

import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/style.scss'

import './blocks/header'
import './blocks/aside'
import './blocks/content'
import './blocks/loading'
import './blocks/button'

import './modules/data'
import './modules/clustering'
import './modules/norming'
import './modules/normingChart'
import './modules/mapSetting'
import './modules/forecastParameters'
import './modules/seasonalityGlobalChecked'
import './modules/seasonalityOpen'
import './modules/seasonality_visualLines'
import './modules/parametersGlobalChecked'
import './modules/regularGlobalChecked'
import './modules/forecast'
import './modules/driver'
import './modules/driverChart'
import './modules/priority'
import './modules/control'
import './modules/report'
import './modules/modelingResult'
import './modules/controlChart'

import './modules/clasteringCreate'

//REG ASSORT********
window.loadAndFilterData = function () {
  console.log("Функция работает!");
  window.saveGlobalParametersRegular = function () {
    let currentData = JSON.parse(localStorage.getItem('globalParameters'));
    if (!currentData) {
      currentData = {};
    }
    const regularAssortMethodForecast = document.getElementById('regular_assort_method');
    const regular_method = regularAssortMethodForecast.value;
    console.log('Выбранный метод прогноза:', regular_method);

    currentData['методы прогноза'] = regular_method;
    localStorage.setItem('globalParameters', JSON.stringify(currentData));
  }
  window.saveGlobalParametersRegular();

  // Получаем параметры из localStorage
  const parameters = JSON.parse(localStorage.getItem('globalParameters'));
  const iframe = document.getElementById('tb_regular_assort_results');
  // Проверяем наличие ключей и выводим соответствующие сообщения
  if (!parameters || !parameters['очистка от выбросов']) {
    iframe.contentDocument.body.innerHTML = '<p>Выберите глобальные параметры</p>';
    return; // Прекращаем выполнение функции
  }
  if (!parameters['сезонность']) {
    iframe.contentDocument.body.innerHTML = '<p>Выберите метод расчета сезонности</p>';
    return; // Прекращаем выполнение функции
  }
  window.filterData = function (data) {
    const parameters = JSON.parse(localStorage.getItem('globalParameters'));
    return data.filter(row => {
      return Object.keys(parameters).every(key => {
        if (row[key] !== undefined) {
          return row[key].toString().toLowerCase() === parameters[key].toString().toLowerCase();   // Приведение к нижнему регистру для независимости от регистра
        }
        return true;
      });
    });
  };

  window.displayTable = function (data) {
    const iframe = document.getElementById('tb_regular_assort_results');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';



    // Добавление стилей
    const style = document.createElement('style');
    style.textContent =
      `
  table {
         width: 100%;
  border-collapse: collapse;
  font-family: Inter, sans-serif;
  font-size: 14px;
  background-color: white;
  border-radius: 8px; /* Закругляем углы */
  overflow: hidden; /* Скрываем острые углы у ячеек */
  border-style: hidden; /* Скрываем внешнюю границу таблицы (опционально) */
  box-shadow: 0 0 0 1px #E0E0E0; /* Восстанавливаем видимость границы (опционально) */
  }
  th, td {
      padding: 12px 15px;
      text-align: left;
      border: 1px solid #E0E0E0;
  }
  th {
      background-color: #F1F2FF;
      color: #333;
      font-weight: 600;
      border-bottom: 2px solid #D0D0D0;
  }
  tr {
      background-color: white;
  }
  tr:hover {
      background-color: #F8F8F8;
  }
`
      ;
    iframeDocument.head.appendChild(style);
    const table = iframeDocument.createElement('table');
    table.innerHTML = ''; // Очистка предыдущего содержимого
    if (data.length === 0) {
      table.innerHTML = '<tr><td colspan="100%">Нет данных для отображения</td></tr>';
      iframeDocument.body.appendChild(table);
      return;
    }

    // Определяем желаемый порядок
    const desiredOrder = [
      'WAPE, %',
      'BIAS, %',
      'Кол-во позиций с прогнозом',
      'Всего позиций с продажами',
      'Доля, %',
      'недопрогноз, %',
      'перепрогноз, %',
      'Объем прогноза, шт',
      'Объем продаж, шт',
      'Доля, %2'
    ];
    // Сортируем данные по желаемому порядку
    data.sort((a, b) => {
      const indexA = desiredOrder.indexOf(a['МЕРЫ']); // Приводим к нижнему регистру
      const indexB = desiredOrder.indexOf(b['МЕРЫ']);

      // Сравниваем индексы
      return indexA - indexB;
    });

    // Создание заголовков, начиная с 7-го столбца
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    for (let i = 6; i < headers.length; i++) { // Начинаем с 7-го столбца (индекс 6)
      const th = document.createElement('th');
      th.textContent = headers[i];
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    const percentColumns = ['WAPE, %', 'BIAS, %', 'Доля, %', 'Доля, %2', 'недопрогноз, %', 'перепрогноз, %'];

    // Заполнение таблицы данными, начиная с 7-го столбца
    data.forEach(row => {
      const tr = document.createElement('tr');
      for (let i = 6; i < headers.length; i++) { // Начинаем с 7-го столбца (индекс 6)
        const td = document.createElement('td');
        let cellValue = row[headers[i]];

        if (typeof cellValue === 'number') {
          // Проверяем, есть ли соответствующее название в столбце "МЕРЫ"
          if (row['МЕРЫ'] && percentColumns.includes(row['МЕРЫ'])) {
            cellValue = (cellValue * 100).toFixed(0) + '%'; // Преобразование в процент
          } else {
            cellValue = cellValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });// Округл, разделение на локали до без знаков после запятой для остальных чисел
          }
        }
        td.textContent = cellValue;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    });
    iframeDocument.body.appendChild(table);
  };

  // const url = './public/images/users/regAssort2.xlsx';// ссылки для локального компа
  fetch('./public/images/demo_file/regAssort3.xlsx') // ссылки для локального компа
    //const url = '   https://raw.githubusercontent.com/Kujavia/SputnikPro_test_2_2/master/public/images/demo_file/regAssort3.xlsx';
    //fetch('   https://raw.githubusercontent.com/Kujavia/SputnikPro_test_2_2/master/public/images/demo_file/regAssort3.xlsx')
    //fetch('./public/images/demo_file/regAssort3.xlsx')// ссылки для локального компа
    .then(response => {
      if (!response.ok) {
        throw new Error('Сеть не отвечает');
      }
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // console.log(jsonData); // Проверка загруженных данных

      const filteredData = window.filterData(jsonData);
      window.displayTable(filteredData);
    })
    .catch(error => {
      console.error('Ошибка загрузки файла:', error);
    });
};

//const csvUrl = './public/images/map_start.csv';

//карта1
function loadData(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      callback(results.data);
    }
  });
}

const map = L.map('map').setView([55.1800, 61.4000], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const goodMarkers = L.layerGroup();
const badMarkers = L.layerGroup();
const highlightLayer = L.layerGroup();

function parseCoordinate(coord) {
  return typeof coord === 'string' ? parseFloat(coord.replace(',', '.')) : coord;
}

function updateMap(data, selectedCluster, selectedFormat, selectedDriver) {
  goodMarkers.clearLayers();
  badMarkers.clearLayers();
  highlightLayer.clearLayers();

  const redPoints = [];
  const greenPoints = [];

  // Связь драйвера с соответствующим столбцом
  const driverColumnMap = {
    'Ассортимент': 'Ассортимент,добавить sku:',
    'Цена': 'Цена, снизить sku:',
    'Выкладка ХП': 'Выкладка на ХП, добавить:',
    'Выкладка ТП': 'Выкладка на ТП, добавить:',
    'Оборудование': 'Оборудование, добавить:',
    'ДМП': 'ДМП, добавить:'
  };

  data.forEach(store => {
    if ((selectedCluster === "" || store.Кластер === selectedCluster) &&
      (selectedFormat === "" || store['Субканал (формат)'] === selectedFormat)) {

      // Проверка фильтра по драйверу
      if (selectedDriver !== "Все драйверы") {
        const columnName = driverColumnMap[selectedDriver];
        if (!store[columnName]) return; // Пропускаем магазин, если в столбце нет данных
      }

      const lat = parseCoordinate(store.Широта);
      const lng = parseCoordinate(store.Долгота);
      const isRed = store['Топ/аут'] !== 1;
      const potentialPercentage = (store['Потенциал продаж'] * 100).toFixed(2) + '%';
      const sales = typeof store['Продажи'] === 'number' ? store['Продажи'].toFixed(2) : 'Нет данных';

      let popupContent = `<b>${store['Название ТТ']}</b><br>
                          Потенциал продаж: ${potentialPercentage}<br>
                          Продажи: ${sales}<br>
                          Формат: ${store['Субканал (формат)']}<br>`;

      const additionalFields = {
        'Ассортимент, добавить sku:': store['Ассортимент,добавить sku:'],
        'Цена, снизить sku:': store['Цена, снизить sku:'],
        'Выкладка на ХП, добавить:': store['Выкладка на ХП, добавить:'],
        'Выкладка на ТП, добавить:': store['Выкладка на ТП, добавить:'],
        'Оборудование, добавить:': store['Оборудование, добавить:'],
        'ДМП, добавить:': store['ДМП, добавить:']
      };

      for (const [label, value] of Object.entries(additionalFields)) {
        if (value) {
          popupContent += `${label} ${value}<br>`;
        }
      }

      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: isRed ? 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
            : 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          iconSize: [12, 20],
          iconAnchor: [6, 20]
        })
      }).bindPopup(popupContent);

      if (isRed) {
        badMarkers.addLayer(marker);
        redPoints.push(turf.point([lng, lat]));
      } else {
        goodMarkers.addLayer(marker);
        greenPoints.push(turf.point([lng, lat]));
      }
    }
  });

  // Генерация тепловых гексагонов
  if (redPoints.length > 0 || greenPoints.length > 0) {
    const allPoints = [...redPoints, ...greenPoints];
    const bbox = turf.bbox(turf.featureCollection(allPoints));
    const hexGrid = turf.hexGrid(bbox, 0.5, { units: 'kilometers' });

    hexGrid.features.forEach(hex => {
      const redPtsWithin = turf.pointsWithinPolygon(turf.featureCollection(redPoints), hex).features.length;
      const greenPtsWithin = turf.pointsWithinPolygon(turf.featureCollection(greenPoints), hex).features.length;

      if (redPtsWithin > 0 || greenPtsWithin > 0) {
        const redIntensity = Math.min(1, redPtsWithin / 10);
        const greenIntensity = Math.min(1, greenPtsWithin / 10);

        L.polygon(hex.geometry.coordinates[0].map(coord => [coord[1], coord[0]]), {
          color: 'none',
          fillColor: redPtsWithin > greenPtsWithin ? `rgba(255, 0, 0, ${redIntensity})`
            : `rgba(0, 255, 0, ${greenIntensity})`,
          fillOpacity: 0.5
        }).addTo(highlightLayer);
      }
    });
  }

  goodMarkers.addTo(map);
  badMarkers.addTo(map);
  highlightLayer.addTo(map);
}

// const csvUrl = './public/images/map_start.csv';
// https://github.com/Kujavia/ES/blob/master/public/images/map_start.csv
const csvUrl = '   https://raw.githubusercontent.com/Kujavia/ES/master/public/images/map_start.csv';
loadData(csvUrl, function (data) {
  data = data.filter(store => store['Название ТТ']);
  const clusters = [...new Set(data.map(store => store.Кластер))];
  const formats = [...new Set(data.map(store => store['Субканал (формат)']))];

  const clusterFilter = document.getElementById('cluster-filter');
  const formatFilter = document.getElementById('format-filter');
  const driverFilter = document.getElementById('driver-filter');

  clusters.forEach(cluster => {
    clusterFilter.innerHTML += `<option value="${cluster}">${cluster}</option>`;
  });

  formats.forEach(format => {
    formatFilter.innerHTML += `<option value="${format}">${format}</option>`;
  });

  updateMap(data, "", "", "Все драйверы");

  clusterFilter.addEventListener('change', () => {
    updateMap(data, clusterFilter.value, formatFilter.value, driverFilter.value);
  });

  formatFilter.addEventListener('change', () => {
    updateMap(data, clusterFilter.value, formatFilter.value, driverFilter.value);
  });

  driverFilter.addEventListener('change', () => {
    updateMap(data, clusterFilter.value, formatFilter.value, driverFilter.value);
  });
});


//карта2



document.addEventListener('DOMContentLoaded', function () {
  // Объект с данными для каждого типа драйвера
  const driverValues = {
    'Все': { time: 20, profit: 15000, probability: 0.9, expenses: 10000 },
    'Ассортимент': { time: 25, profit: 12000, probability: 0.8, expenses: 8000 },
    'Цена': { time: 15, profit: 18000, probability: 0.85, expenses: 9000 },
    'Оборудование': { time: 30, profit: 10000, probability: 0.75, expenses: 7000 },
    'Выкладка на ХП': { time: 20, profit: 15000, probability: 0.9, expenses: 10000 },
    'Выкладка на ТП': { time: 18, profit: 16000, probability: 0.88, expenses: 9500 },
    'ДМП': { time: 22, profit: 14000, probability: 0.82, expenses: 8500 }
  };

  // Функция для расчета итогового значения
  function calculateTotal(profit, probability, expenses, time) {
    return (profit * probability) / (expenses * time);
  }

  // Обработчик события для динамически загружаемого селекта
  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'draiver_typesPriority') {
      const selectedValue = e.target.value;

      if (driverValues[selectedValue]) {
        const { time, profit, probability, expenses } = driverValues[selectedValue];

        // Находим ближайшие поля ввода (если их несколько в таблице)
        const row = e.target.closest('tr') || document; // ищем строку или весь документ
        const timeInput = row.querySelector('#parametersDriverPriorityTime');
        const profitInput = row.querySelector('#parametersDriverPriorityProfit');
        const probabilityInput = row.querySelector('#parametersDriverPriorityProbability');
        const expensesInput = row.querySelector('#parametersDriverPriorityExpenses');
        const totalInput = row.querySelector('#parametersDriverPriorityTotal');

        if (timeInput && profitInput && probabilityInput && expensesInput && totalInput) {
          timeInput.value = time;
          profitInput.value = profit;
          probabilityInput.value = probability;
          expensesInput.value = expenses;

          const total = calculateTotal(profit, probability, expenses, time);
          totalInput.value = total.toFixed(6).replace('.', ','); // форматируем с запятой
        }
      }
    }
  });

  // Обработчик для ручного изменения полей (если нужно пересчитывать при их изменении)
  document.addEventListener('input', function (e) {
    const target = e.target;
    const isRelevantInput = target.id === 'parametersDriverPriorityTime' ||
      target.id === 'parametersDriverPriorityProfit' ||
      target.id === 'parametersDriverPriorityProbability' ||
      target.id === 'parametersDriverPriorityExpenses';

    if (isRelevantInput) {
      const row = target.closest('tr') || document;
      const timeInput = row.querySelector('#parametersDriverPriorityTime');
      const profitInput = row.querySelector('#parametersDriverPriorityProfit');
      const probabilityInput = row.querySelector('#parametersDriverPriorityProbability');
      const expensesInput = row.querySelector('#parametersDriverPriorityExpenses');
      const totalInput = row.querySelector('#parametersDriverPriorityTotal');

      if (timeInput && profitInput && probabilityInput && expensesInput && totalInput) {
        const time = parseFloat(timeInput.value.replace(',', '.')) || 0;
        const profit = parseFloat(profitInput.value.replace(',', '.')) || 0;
        const probability = parseFloat(probabilityInput.value.replace(',', '.')) || 0;
        const expenses = parseFloat(expensesInput.value.replace(',', '.')) || 0;

        const total = calculateTotal(profit, probability, expenses, time);
        totalInput.value = total.toFixed(6).replace('.', ',');
      }
    }
  });
});





