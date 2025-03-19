import 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/style.scss'
import { DBSCAN } from 'density-clustering';
import { mlKMeans } from 'density-clustering';
import Chart from 'chart.js/auto';

import './blocks/header'
import './blocks/aside'
import './blocks/content'
import './blocks/loading'
import './blocks/button'

import './modules/data'
import './modules/clustering'
import './modules/norming'
import './modules/normingChart'
import './modules/targets'
import './modules/mapSetting'
import './modules/forecastParameters'
import './modules/forecast'
import './modules/driver'
import './modules/driverChart'
import './modules/priority'
import './modules/control'
import './modules/report'
import './modules/modelingResult'
import './modules/controlChart'




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

const csvUrl = './public/images/map_start.csv';
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





/// дата контроль
//   document.addEventListener('DOMContentLoaded', function() {
//     loadCSVFromURL('./public/images/demo_file/control_data.csv');
// });

//  window.showmodalDataControl = function (title) {
//     const modalDataControl = document.getElementById('modalDataControl');
//     const modalDataControlText = document.getElementById('modalDataControl-text');
//     modalDataControlText.textContent = `Обновление: ${title}`;
//     modalDataControl.style.display = 'flex';
//     setTimeout(() => {
//         modalDataControl.style.display = 'none';
//     }, 3000);
// }

//  window.getRandomNumber = function(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// window.loadCSVFromURL = function (url) {
//     fetch(url)
//         .then(response => response.text())
//         .then(text => {
//             const rows = text.split('\n');
//             const tableBody = document.querySelector('#dataTable tbody');
//             tableBody.innerHTML = '';

//             rows.forEach((row, index) => {
//                 if (index === 0) return; // Пропускаем заголовок

//                 const columns = row.split(';');
//                 if (columns.length < 7) return;

//                 const tr = document.createElement('tr');

//                 columns.slice(0, 6).forEach(col => {
//                     const td = document.createElement('td');
//                     td.textContent = col.trim();
//                     tr.appendChild(td);
//                 });

//                 // Рассчитываем процент
//                 const fact = parseInt(columns[4].trim()) || 0;
//                 const target = parseInt(columns[5].trim()) || 1;
//                 const percentage = ((fact / target) * 100).toFixed(2);
//                 const percentTd = document.createElement('td');
//                 percentTd.textContent = `${percentage}%`;
//                 if (percentage < 90) {
//                     percentTd.classList.add('low-percentage');
//                 }
//                 tr.appendChild(percentTd);

//                 // Добавляем кнопку обновления
//                 const buttonTd = document.createElement('td');
//                 const button = document.createElement('button');
//                 button.textContent = 'Обновить';
//                 button.addEventListener('click', function() {
//                     showmodalDataControl(columns[1].trim());
//                     setTimeout(() => {
//                         tr.children[3].textContent = new Date().toLocaleString();
//                         const newFact = getRandomNumber(10000, 20000);
//                         tr.children[4].textContent = newFact;
//                         const newPercentage = ((newFact / target) * 100).toFixed(2);
//                         percentTd.textContent = `${newPercentage}%`;
//                         if (newPercentage < 90) {
//                             percentTd.classList.add('low-percentage');
//                         } else {
//                             percentTd.classList.remove('low-percentage');
//                         }
//                     }, 3000);
//                 });
//                 buttonTd.appendChild(button);
//                 tr.appendChild(buttonTd);

//                 tableBody.appendChild(tr);
//             });
//         })
//         .catch(error => console.error('Ошибка загрузки CSV:', error));
// }


// document.addEventListener("DOMContentLoaded", () => {
//   const selectMethod = document.getElementById("method");
//   const numClustersInput = document.getElementById("numClusters");
//   const normalizeCheckbox = document.getElementById("normalize");
//   const formatSelect = document.getElementById("format");
//   const startButton = document.getElementById("start");
//   const chartcontainerClast = document.getElementById("chart");
//   const calinskiDiv = document.getElementById("calinski");
//   const daviesDiv = document.getElementById("davies");

//   let data = [];
//   fetch("./public/images/demo_file/cluster.json")
//     .then(res => res.json())
//     .then(d => {
//       data = Array.isArray(d) ? d : Object.values(d)[0] || [];
//       const formats = [...new Set(data.map(item => item["Субканал"]))];
//       formatSelect.innerHTML = formats.map(f => `<option value="${f}">${f}</option>`).join('');
//     })
//     .catch(err => console.error("Ошибка загрузки JSON:", err));

//   startButton.addEventListener("click", () => {
//     let filteredData = data;
//     if (formatSelect.value) {
//       filteredData = data.filter(d => d["Субканал"] === formatSelect.value);
//     }

//     let points = filteredData.map(d => [d["Продажи"], d["СКЮ количество"], d["Трафик"]]);
//     if (normalizeCheckbox.checked) {
//       points = normalizeData(points);
//     }

//     let clusters = [];
//     if (selectMethod.value === "k-means") {
//       kMeansClustering(points, parseInt(numClustersInput.value))
//         .then(clusterLabels => {
//           renderChart(clusterLabels, points);
//           calculateClusterQuality(clusterLabels, points);
//         });
//     } else if (selectMethod.value === "DBSCAN") {
//       dbscanClustering(points)
//         .then(clusterLabels => {
//           renderChart(clusterLabels, points);
//           calculateClusterQuality(clusterLabels, points);
//         });
//     }
//   });

//   function normalizeData(points) {
//     return points.map((row, i) => row.map((val, j) => (val - Math.min(...points.map(d => d[j]))) / (Math.max(...points.map(d => d[j])) - Math.min(...points.map(d => d[j])))));
//   }

//   async function kMeansClustering(points, k) {
//     if (typeof mlKMeans === 'undefined') {
//       console.error('ml-kmeans library is not loaded properly');
//       return [];
//     }

//     const result = await mlKMeans.kmeans(points, k, { initialization: 'kmeans++' });
//     return result.clusters; // Возвращает метки кластеров
//   }

//   async function dbscanClustering(points) {
//     const dbscan = new DBSCAN();
//     const epsilon = 1.5; // Радиус
//     const minPts = 2;    // Минимальное количество точек в кластере

//     const clusters = dbscan.run(points, epsilon, minPts);
//     let clusterLabels = new Array(points.length).fill(-1);

//     // Метки кластеров
//     clusters.forEach((cluster, i) => {
//       cluster.forEach(index => clusterLabels[index] = i);
//     });

//     return clusterLabels;
//   }

//   function renderChart(clusters, points) {
//     chartcontainerClast.innerHTML = "<canvas id='chartCanvas'></canvas>";
//     const ctx = document.getElementById("chartCanvas").getContext("2d");

//     const colors = ["red", "blue", "green", "orange", "purple", "brown", "pink"];
//     const datasets = [];

//     clusters.forEach((c, i) => {
//       if (!datasets[c]) datasets[c] = { label: `Кластер ${c}`, data: [], backgroundColor: colors[c % colors.length] };
//       datasets[c].data.push({ x: points[i][0], y: points[i][1], r: 5 }); // X - продажи, Y - СКЮ
//     });

//     new Chart(ctx, {
//       type: "bubble",
//       data: { datasets: datasets.filter(d => d) },
//       options: {
//         responsive: true,
//         scales: {
//           x: { title: { display: true, text: "Продажи" } },
//           y: { title: { display: true, text: "СКЮ количество" } }
//         }
//       }
//     });
//   }

//   function calculateClusterQuality(clusters, points) {
//     const calinski = calculateCalinskiHarabasz(clusters, points);
//     const davies = calculateDaviesBouldin(clusters, points);

//     calinskiDiv.textContent = `Calinski-Harabasz: ${calinski}`;
//     daviesDiv.textContent = `Davies-Bouldin: ${davies}`;
//     calinskiDiv.className = calinski > 100 ? "success" : "error";
//     daviesDiv.className = davies < 1 ? "success" : "error";
//   }

//   function calculateCalinskiHarabasz(clusters, points) {
//     // Простая заглушка для расчета
//     return clusters.length * 10;
//   }

//   function calculateDaviesBouldin(clusters, points) {
//     // Простая заглушка для расчета
//     return clusters.length / points.length;
//   }
// });


////////////////norming
//   const data = {
//     "Конвиниенс": { sales: 141348.03947180862, norm: 161649.36087550133 },
//     "Супермаркеты": { sales: 1802.534153507743, norm: 2624.56686710316 },
//     "Торговля через прилавок": { sales: 84467.20848976781, norm: 95290.38078650815 },
//     "Гипермаркеты": { sales: 9706.03947180862, norm: 10490.36087550133 },
//     "Дискаунтеры": { sales: 2498.59549677048, norm: 3035.5894459773 },
//     "Киоски": { sales: 1376.20425947434, norm: 1556.20701538227 },
//     "Алкомаркеты": { sales: 102349.559738584, norm: 117555.93670787 },
//     "Бирбутики": { sales: 43875.0315196673, norm: 49705.4615542462 },
//     "Ресторан": { sales: 7628.73549677048, norm: 8186.9994459773 },
//     "Вендинг": { sales: 596.20425947434, norm: 665.20701538227 }
// };

// let myChart;

// window.updateChartNorm = function() {
//     const selectedFormat = document.getElementById('formatSelectNorm').value;
//     let labels = [];
//     let salesData = [];
//     let normData = [];
//     let totalSales = 0;
//     let totalNorm = 0;

//     if (selectedFormat === "Все") {
//         // Если выбрано "Все", добавляем данные для всех форматов
//         for (const format in data) {
//             labels.push(format);
//             salesData.push(data[format].sales);
//             normData.push(data[format].norm);
//             totalSales += data[format].sales;
//             totalNorm += data[format].norm;
//         }
//     } else {
//         // Если выбран конкретный формат, добавляем данные только для него
//         labels.push(selectedFormat);
//         salesData.push(data[selectedFormat].sales);
//         normData.push(data[selectedFormat].norm);
//         totalSales = data[selectedFormat].sales;
//         totalNorm = data[selectedFormat].norm;
//     }

//     if (myChart) {
//         myChart.destroy();
//     }

//     const ctx = document.getElementById('salesChart').getContext('2d');
//     myChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: 'Продажи',
//                     data: salesData,
//                     backgroundColor: 'rgba(255, 206, 86, 0.2)',
//                     borderColor: 'rgba(255, 206, 86, 1)',
//                     borderWidth: 1
//                 },
//                 {
//                     label: 'Нормы',
//                     data: normData,
//                     backgroundColor: 'rgba(153, 102, 255, 0.2)',
//                     borderColor: 'rgba(153, 102, 255, 1)',
//                     borderWidth: 1
//                 }
//             ]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });

//     const potentialSales = ((totalNorm - totalSales) / totalSales).toFixed(2);
//     document.getElementById('potentialSales').innerText = `Потенциал продаж: ${potentialSales}`;
// }