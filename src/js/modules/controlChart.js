const data = {
    labels: ["Ассортимент", "Цена", "Выкладка ХП", "Выкладка ТП", "Оборудование", "ДМП"],
    datasets: [{
        label: "Общий процент выполнения по драйверам",
        data: [63, 13, 75, 85, 10, 14],
        backgroundColor: "#CACCF7",
        borderColor: "#474BAB",
        borderWidth: 1
    }]
};

const config = {
    type: "bar",
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
};

window.updateChartControl = function () {
    const container = document.getElementById("potentialSalesPriority");
    container.innerHTML = ""; // Очищаем контейнер перед добавлением нового графика
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    new Chart(canvas, config);
}

const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
script.onload = () => {
    document.getElementById("updateChartDriverButton").addEventListener("click", updateChartControl);
};
document.head.appendChild(script);