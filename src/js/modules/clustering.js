import { Chart, plugins } from "chart.js/auto";

window.clusteringOpen = function () {
  fetch("./src/html/clustering.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Реакция сети" + response.statusText);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById("content").innerHTML = html;
      // Инициализируем оба графика, но показываем только один
      clusteringChartDraw();
      clusteringChartDrawStarts();
      // Показываем график по умолчанию
      toggleCharts();
    })
    .catch((error) => {
      console.error("Возникла проблема с операцией выборки:", error);
    });
};

window.formParameterValue = function (radio) {
  const kmeansInput = document.querySelector('input[name="clasteringVariantsValue"]');

  if (radio.value === "kmeans") {
    kmeansInput.disabled = false;
    kmeansInput.style.display = "inline-block";
  } else {
    kmeansInput.disabled = true;
    kmeansInput.style.display = "none";
  }

  // При переключении радио кнопок переключаем графики
  toggleCharts();
}

// Функция для переключения между графиками
function toggleCharts() {
  const scatterChart = document.getElementById("clusteringChart");
  const barChart = document.getElementById("clusteringChartBar");
  const radioHandle = document.getElementById("radioHandleClustering");

  if (radioHandle.checked) {
    scatterChart.style.display = "none";
    barChart.style.display = "block";
  } else {
    scatterChart.style.display = "block";
    barChart.style.display = "none";
  }
}

// График с точечной диаграммой (оригинальный)
window.clusteringChartDraw = function () {
  const chart = document.getElementById("clusteringChart");

  function generateOvalCluster(centerX, centerY, count, radiusX, radiusY) {
    let cluster = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random());
      cluster.push({
        x: centerX + Math.cos(angle) * distance * radiusX,
        y: centerY + Math.sin(angle) * distance * radiusY
      });
    }
    return cluster;
  }

  var clusterBlue = generateOvalCluster(1.5, 5, 360, 1.5, 4);
  var clusterGreen = generateOvalCluster(3, 7, 384, 1, 4);
  var clusterYellow = generateOvalCluster(4.5, 3, 264, 2, 1.5);
  var clusterGrey = generateOvalCluster(3.5, 1, 325, 1.5, 1.5);
  var clusterMer = generateOvalCluster(4.7, 7, 556, 1.2, 4);

  var options = {
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Точечная диаграмма кластеров'
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 8,
        title: {
          display: true,
          text: 'Ось X'
        }
      },
      y: {
        min: 0,
        max: 12,
        title: {
          display: true,
          text: 'Ось Y'
        }
      }
    }
  };

  new Chart(chart, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "BTC1",
          data: clusterBlue,
          borderColor: "#2196f3",
          backgroundColor: "#2196f3",
          pointRadius: 3
        },
        {
          label: "BTC2",
          data: clusterGreen,
          borderColor: "#4caf50",
          backgroundColor: "#4caf50",
          pointRadius: 3
        },
        {
          label: "BTC3",
          data: clusterYellow,
          borderColor: "#ffeb3b",
          backgroundColor: "#ffeb3b",
          pointRadius: 3
        },
        {
          label: "BTC4",
          data: clusterGrey,
          borderColor: "#CACCF7",
          backgroundColor: "#CACCF7",
          pointRadius: 3
        },
        {
          label: "BTC5",
          data: clusterMer,
          borderColor: "#ffe4b5",
          backgroundColor: "#ffe4b5",
          pointRadius: 3
        }
      ],
    },
    options: options,
  });
};

// Новая функция для столбчатой диаграммы
window.clusteringChartDrawStarts = function () {
  const chart = document.getElementById("clusteringChartBar");

  // Генерируем случайные данные для 12 магазинов
  const labels = Array.from({ length: 12 }, (_, i) => `BTC${100 + i}`);
  const salesData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000) + 500);
  const shopCounts = Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 5);

  const options = {
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Распределение точек по кластерам'
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Магазины'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Продажи / Количество магазинов'
        }
      }
    }
  };

  new Chart(chart, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Продажи",
          data: salesData,
          backgroundColor: "#4caf50",
          borderColor: "#4caf50",
          borderWidth: 1
        },
        {
          label: "Количество магазинов",
          data: shopCounts,
          backgroundColor: "#2196f3",
          borderColor: "#2196f3",
          borderWidth: 1,
          type: 'line', // Комбинированный график
          tension: 0.1
        }
      ]
    },
    options: options
  });
};

window.createClusters = function () {
  const kmeansRadio = document.querySelector('input[name="clasteringVariants"][value="kmeans"]');
  const handleRadio = document.getElementById("radioHandleClustering");
  const clusterValue = document.getElementById('clusteringKmeansQwCluster').value;
  const alertDiv = document.querySelector('.alertClusteringNotParameters');
  const bottomBlock = document.querySelector('div.column.clustering_bottom');
  const varianceInput = document.getElementById('varianceRatioCriterion');
  const daviesInput = document.getElementById('daviesBouldinIndex');

  const resetInputs = () => {
    if (varianceInput) {
      varianceInput.value = '0';
      varianceInput.style.backgroundColor = '';
    }
    if (daviesInput) {
      daviesInput.value = '0';
      daviesInput.style.backgroundColor = '';
    }
  };

  if (!kmeansRadio.checked && !handleRadio.checked) {
    if (alertDiv) {
      alertDiv.textContent = "Выберите параметры для расчета";
      alertDiv.style.display = 'block';
      setTimeout(() => {
        alertDiv.style.display = 'none';
      }, 3000);
    }
    if (bottomBlock) bottomBlock.style.display = 'none';
    resetInputs();
    return;
  } else {
    if (alertDiv) alertDiv.style.display = 'none';
  }

  // Если выбрана обработка кластеризации
  if (handleRadio.checked) {
    if (bottomBlock) bottomBlock.style.display = 'block';
    if (varianceInput) {
      varianceInput.value = '0.7';
      varianceInput.style.backgroundColor = '#d4edda';
    }
    if (daviesInput) {
      daviesInput.value = '2.3';
      daviesInput.style.backgroundColor = '#d4edda';
    }
  }
  // Если выбрана K-means кластеризация
  else if (clusterValue === '5') {
    if (bottomBlock) bottomBlock.style.display = 'block';
    if (varianceInput) {
      varianceInput.value = '0.5';
      varianceInput.style.backgroundColor = '#d4edda';
    }
    if (daviesInput) {
      daviesInput.value = '2';
      daviesInput.style.backgroundColor = '#d4edda';
    }
  } else {
    if (bottomBlock) bottomBlock.style.display = 'none';
    resetInputs();
  }

  // Переключаем графики при нажатии кнопки
  toggleCharts();
}


// import { Chart, plugins } from "chart.js/auto";

// window.clusteringOpen = function () {
//   fetch("./src/html/clustering.html")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Реакция сети" + response.statusText);
//       }
//       return response.text();
//     })
//     .then((html) => {
//       document.getElementById("content").innerHTML = html;
//       clusteringChartDraw();
//       clusteringChartDrawStrats()
//     })
//     .catch((error) => {
//       console.error("Возникла проблема с операцией выборки:", error);
//     });
// };


// // clusteringOpen();
// //
// window.formParameterValue = function (radio) {
//   const kmeansInput = document.querySelector('input[name="clasteringVariantsValue"]');

//   if (radio.value === "kmeans") {
//     kmeansInput.disabled = false;
//     kmeansInput.style.display = "inline-block"; // или "block", в зависимости от вашего layout
//   } else {
//     kmeansInput.disabled = true;
//     kmeansInput.style.display = "none";
//   }
// }

// window.clusteringChartDrawStarts = function () { }

// window.clusteringChartDraw = function () {
//   const chart = document.getElementById("clusteringChart");

//   function generateOvalCluster(centerX, centerY, count, radiusX, radiusY) {
//     let cluster = [];
//     for (let i = 0; i < count; i++) {
//       const angle = Math.random() * Math.PI * 2;
//       const distance = Math.sqrt(Math.random()); // квадратный корень для равномерного распределения

//       cluster.push({
//         x: centerX + Math.cos(angle) * distance * radiusX,
//         y: centerY + Math.sin(angle) * distance * radiusY
//       });
//     }
//     return cluster;
//   }

//   // Генерация овальных кластеров с разными параметрами
//   var clusterBlue = generateOvalCluster(1.5, 5, 360, 1.5, 4);   // горизонтальный овал
//   var clusterGreen = generateOvalCluster(3, 7, 384, 1, 4);  // вертикальный овал
//   var clusterYellow = generateOvalCluster(4.5, 3, 264, 2, 1.5); // слегка овальный
//   var clusterGrey = generateOvalCluster(3.5, 1, 325, 1.5, 1.5); // почти круглый
//   var clusterMer = generateOvalCluster(4.7, 7, 556, 1.2, 4);  // вертикальный овал

//   var options = {
//     plugins: {
//       legend: {
//         display: true,
//       },
//     },
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         min: 0,
//         max: 8
//       },
//       y: {
//         min: 0,
//         max: 12
//       }
//     }
//   };

//   var myChart = new Chart(chart, {
//     type: "scatter",
//     data: {
//       datasets: [
//         {
//           label: "BTC1",
//           data: clusterBlue,
//           borderColor: "#2196f3",
//           backgroundColor: "#2196f3",
//           pointRadius: 3
//         },
//         {
//           label: "BTC2",
//           data: clusterGreen,
//           borderColor: "#4caf50",
//           backgroundColor: "#4caf50",
//           pointRadius: 3
//         },
//         {
//           label: "BTC3",
//           data: clusterYellow,
//           borderColor: "#ffeb3b",
//           backgroundColor: "#ffeb3b",
//           pointRadius: 3
//         },
//         {
//           label: "BTC4",
//           data: clusterGrey,
//           borderColor: "#CACCF7",
//           backgroundColor: "#CACCF7",
//           pointRadius: 3
//         },
//         {
//           label: "BTC5",
//           data: clusterMer,
//           borderColor: "#ffe4b5",
//           backgroundColor: "#ffe4b5",
//           pointRadius: 3
//         }
//       ],
//     },
//     options: options,
//   });
// };

// window.createClusters = function () {
//   const kmeansRadio = document.querySelector('input[name="clasteringVariants"][value="kmeans"]');
//   const clusterValue = document.getElementById('clusteringKmeansQwCluster').value;
//   const alertDiv = document.querySelector('.alertClusteringNotParameters');
//   const bottomBlock = document.querySelector('div.column.clustering_bottom');
//   const varianceInput = document.getElementById('varianceRatioCriterion');
//   const daviesInput = document.getElementById('daviesBouldinIndex');

//   // Функция для сброса инпутов
//   const resetInputs = () => {
//     if (varianceInput) {
//       varianceInput.value = '0';
//       varianceInput.style.backgroundColor = '';
//     }
//     if (daviesInput) {
//       daviesInput.value = '0';
//       daviesInput.style.backgroundColor = '';
//     }
//   };

//   // Если K-means не выбран
//   if (!kmeansRadio.checked) {
//     // Показываем сообщение
//     if (alertDiv) {
//       alertDiv.textContent = "Выберите параметры для расчета";
//       alertDiv.style.display = 'block';

//       setTimeout(() => {
//         alertDiv.style.display = 'none';
//       }, 3000);
//     }

//     // Скрываем блок и сбрасываем инпуты
//     if (bottomBlock) bottomBlock.style.display = 'none';
//     resetInputs();

//     return;
//   } else {
//     // Скрываем сообщение, если было показано
//     if (alertDiv) alertDiv.style.display = 'none';
//   }

//   if (clusterValue === '5') {
//     // Показываем блок
//     if (bottomBlock) bottomBlock.style.display = 'block';

//     // Устанавливаем значения с подсветкой
//     if (varianceInput) {
//       varianceInput.value = '0.5';
//       varianceInput.style.backgroundColor = '#d4edda';
//     }
//     if (daviesInput) {
//       daviesInput.value = '2';
//       daviesInput.style.backgroundColor = '#d4edda';
//     }
//   } else {
//     // Если значение не 5 - скрываем блок и сбрасываем инпуты
//     if (bottomBlock) bottomBlock.style.display = 'none';
//     resetInputs();
//   }
// }