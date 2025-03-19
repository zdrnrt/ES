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
