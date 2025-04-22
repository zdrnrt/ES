import { Chart } from "chart.js/auto";

window.controlOpen = function () {
    fetch('./src/html/control.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Реакция сети' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('content').innerHTML = html;
            taskAnalyticChartDraw()
        })
        .catch(error => {
            console.error('Возникла проблема с операцией выборки:', error);
        });
}

window.taskAnalyticChartDraw = function () {
    const chartСommerce = document.getElementById('taskСommerceChart');
    const chartOperation = document.getElementById('taskOperationChart');
    const chartItem = document.getElementById('taskItemChart');
    const chartMarketing = document.getElementById('taskMarketingChart');
    const chartForecast = document.getElementById('taskForecastChart');
    const chartLogistic = document.getElementById('taskLogisticChart');
    const chartСommerce2 = document.getElementById('taskСommerceChart2');
    const chartOperation2 = document.getElementById('taskOperationChart2');
    const chartItem2 = document.getElementById('taskItemChart2');
    const chartMarketing2 = document.getElementById('taskMarketingChart2');
    const chartForecast2 = document.getElementById('taskForecastChart2');
    const chartLogistic2 = document.getElementById('taskLogisticChart2');

    const dataChart = [9, 2, 3, 4, 5, 7];
    const labelsChart = ['1', '2', '3', '4', '5', '6']
    const optionsChart = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            yAxes: [{
                // Hide y-axis here
                display: false,
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Amount',
                    fontSize: 20
                }
            }],
            xAxes: [{
                // Hide x-axis here
                display: false
            }
            ]
        }
    }
    const chartParmas = {
        type: 'bar',
        data: {
            labels: labelsChart,
            datasets: [{
                label: '',
                data: dataChart
            }],
        },
        options: optionsChart,
    }

    const сommerce = new Chart(chartСommerce, chartParmas);
    const operation = new Chart(chartOperation, chartParmas);
    const item = new Chart(chartItem, chartParmas);
    const marketing = new Chart(chartMarketing, chartParmas);
    const forecast = new Chart(chartForecast, chartParmas);
    const logistic = new Chart(chartLogistic, chartParmas);
    const сommerce2 = new Chart(chartСommerce2, chartParmas);
    const operation2 = new Chart(chartOperation2, chartParmas);
    const item2 = new Chart(chartItem2, chartParmas);
    const marketing2 = new Chart(chartMarketing2, chartParmas);
    const forecast2 = new Chart(chartForecast2, chartParmas);
    const logistic2 = new Chart(chartLogistic2, chartParmas);
}