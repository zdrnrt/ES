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
      clusteringChartDraw();
    })
    .catch((error) => {
      console.error("Возникла проблема с операцией выборки:", error);
    });
};


// clusteringOpen();

//
window.formParameterValue = function (radio) {
  const kmeansInput = document.querySelector('input[name="clasteringVariantsValue"]');

  if (radio.value === "kmeans") {
    kmeansInput.disabled = false;
    kmeansInput.style.display = "inline-block"; // или "block", в зависимости от вашего layout
  } else {
    kmeansInput.disabled = true;
    kmeansInput.style.display = "none";
  }
}

// // Инициализация при загрузке страницы
// window.onload = function() {
//   const kmeansRadio = document.querySelector('input[name="clasteringVariants"][value="kmeans"]');
//   const kmeansInput = document.querySelector('input[name="clasteringVariantsValue"]');

//   // Если радиокнопка "K-means" выбрана по умолчанию, показываем поле
//   if (kmeansRadio.checked) {
//     kmeansInput.disabled = false;
//     kmeansInput.style.display = "inline-block"; // или "block"
//   } else {
//     kmeansInput.disabled = true;
//     kmeansInput.style.display = "none";
//   }
// };



window.clusteringChartDraw = function () {
  const chart = document.getElementById("clusteringChart");

  function generateCluster(centerX, centerY, count, spread) {
    let cluster = [];
    for (let i = 0; i < count; i++) {
      cluster.push({
        x: centerX + (Math.random() - 0.5) * spread,
        y: centerY + (Math.random() - 0.5) * spread,
      });
    }
    return cluster;
  }

  // Генерация кластеров
  var clusterBlue = generateCluster(5, 5, 200, 2);
  var clusterGreen = generateCluster(5, 8, 150, 3);
  var clusterYellow = generateCluster(7, 9, 180, 2.5);
  var clusterGrey = generateCluster(6.7, 6, 100, 1.5);

  var options = {
    plugins: {
      legend: {
        display: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  var myChart = new Chart(chart, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Cluster 1",
          data: clusterBlue,
          borderColor: "#2196f3",
          backgroundColor: "#2196f3",
        },
        {
          label: "Cluster 2",
          data: clusterGreen,
          borderColor: "#4caf50",
          backgroundColor: "#4caf50",
        },
        {
          label: "Cluster 3",
          data: clusterYellow,
          borderColor: "#ffeb3b",
          backgroundColor: "#ffeb3b",
        },
        {
          label: "Cluster 4",
          data: clusterGrey,
          borderColor: "#CACCF7",
          backgroundColor: "#CACCF7",
        }
      ],
    },
    options: options,
  });
};
