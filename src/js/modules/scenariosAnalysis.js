import { Chart, scales } from 'chart.js/auto';
import { moduleOpen } from '../tools';

window.scenariosAnalysisOpen = function () {
	moduleOpen('./src/html/scenariosAnalysis.html').then(() => {
		scenariosAnalysisInit();
	});
};

// scenariosAnalysisOpen();

function scenariosAnalysisInit() {
	scenariosChartDraw();

	document
		.getElementById('type')
		.addEventListener('change', (event) => { scenariosChartDraw(event.target.value) });
}

function scenariosChartDraw (chartType = 'tt') {
	document.getElementById('info').dataset.state = chartType;
	
	const chartData = {
		fast: {
			tt: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
				],
				datasets: [
					{
						label: 'Итого, план',
						type: 'line',
						data: [
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000, 11_000_000,
						],
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Итого, факт',
						data: [
							12_337_799, 12_452_279, 12_463_887, 12_363_887,
							12_163_887, 11_963_887, 11_763_887, 11_563_887,
							11_363_887, 11_163_887, 10_963_887,
						],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
			rc: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
				],
				datasets: [
					{
						label: 'Итого, план',
						type: 'line',
						data: [
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000, 3_700_000,
						],
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Итого, факт',
						data: [
							4_112_600, 4_150_760, 4_154_629, 4_104_629,
							4_054_629, 4_004_629, 3_954_629, 3_904_629,
							3_854_629, 3_804_629, 3_754_629,
						],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
			represent: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
				],
				datasets: [
					{
						label: 'Итого, план',
						type: 'line',
						data: [98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98],
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Итого, факт',
						data: [79, 91, 90, 90, 91, 92, 93, 94, 95, 96, 97],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
		},
		middle: {
			tt: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
					'30.04',
					'01.05',
					'15.05',
					'30.05',
					// '01.06',
					// '15.06',
					// '30.06',
				],
				datasets: [
					{
						label: 'Итого, план',
						data: [
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000, 11_000_000,
						],
						type: 'line',
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Итого, факт',
						data: [
							12_337_799, 12_452_279, 12_463_887, 12_353_887,
							12_243_887, 12_133_887, 12_023_887, 11_913_887,
							11_803_887, 11_693_887, 11_583_887, 11_473_887,
							11_363_887, 11_253_887, 11_143_887,
						],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
			rc: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
					'30.04',
					'01.05',
					'15.05',
					'30.03',
					// '01.06',
					// '15.06',
					// '30.06',
				],
				datasets: [
					{
						label: 'Итого, план',
						type: 'line',
						data: [
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000, 3_700_000,
						],
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Итого, факт',
						data: [
							4_112_600, 4_150_760, 4_154_629, 4_113_629,
							4_072_629, 4_031_629, 3_990_629, 3_949_629,
							3_908_629, 3_867_629, 3_826_629, 3_785_629,
							3_744_629, 3_703_629, 3_662_629,
						],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
			represent: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
					'30.04',
					'01.05',
					'15.05',
					'30.03',
					// '01.06',
					// '15.06',
					// '30.06',
				],
				datasets: [
					{
						label: 'Итого, план',
						type: 'line',
						data: [
							98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98,
							98, 98,
						],
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Итого, факт',
						data: [
							79, 91, 90, 90, 91, 92, 93, 93, 94, 95, 96, 96, 97,
							98, 98,
						],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
		},
		normal: {
			tt: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
					'30.04',
					'01.05',
					'15.05',
					'30.03',
					'01.06',
					'15.06',
					'30.06',
				],
				datasets: [
					{
						label: 'Итого, план',
						type: 'line',
						data: [
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000, 11_000_000, 11_000_000,
							11_000_000, 11_000_000,
						],
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Итого, факт',
						data: [
							12_337_799, 12_452_279, 12_463_887, 12_367_887,
							12_271_887, 12_175_887, 12_079_887, 11_983_887,
							11_887_887, 11_791_887, 11_695_887, 11_599_887,
							11_503_887, 11_407_887, 11_311_887, 11_215_887,
							11_119_887, 11_023_887,
						],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
			rc: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
					'30.04',
					'01.05',
					'15.05',
					'30.03',
					'01.06',
					'15.06',
					'30.06',
				],
				datasets: [
					{
						label: 'Итого, план',
						type: 'line',
						data: [
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000, 3_700_000, 3_700_000,
							3_700_000, 3_700_000,
						],
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Итого, факт',
						data: [
							4_112_600, 4_150_760, 4_154_629, 4_124_629,
							4_094_629, 4_064_629, 4_034_629, 4_004_629,
							3_974_629, 3_944_629, 3_914_629, 3_884_629,
							3_854_629, 3_824_629, 3_794_629, 3_764_629,
							3_734_629, 3_704_629,
						],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
			represent: {
				labels: [
					'01.01',
					'15.01',
					'30.01',
					'01.02',
					'15.02',
					'28.02',
					'01.03',
					'15.03',
					'30.03',
					'01.04',
					'15.04',
					'30.04',
					'01.05',
					'15.05',
					'30.03',
					'01.06',
					'15.06',
					'30.06',
				],
				datasets: [
					{
						label: 'План, %',
						type: 'line',
						data: [
							98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98,
							98, 98, 98, 98, 98,
						],
						backgroundColor: '#3337A2',
						borderColor: '#3337A2',
					},
					{
						label: 'Факт, %',
						data: [
							79, 91, 90, 90, 91, 91, 92, 92, 93, 93, 94, 94, 95,
							96, 96, 97, 97, 98,
						],
						backgroundColor: '#FD6935',
						borderColor: '#FD6935',
					},
				],
			},
		},
	};

	const chartAction = [
		{
			name: 'Change data',
			handler(value, chart) {
				console.log(chart)
				chart.data.labels = chartData[chart.canvas.id][value].labels;
				chart.data.datasets = chartData[chart.canvas.id][value].datasets;
				// chart.scales = {...chart.scales, ...chartGetScales(value)};
				
				chart.update();
			},
		},
	];

	const chartScales = {
		tt: {
						x: {
							display: false
						},
						y: {
							title: {
								display: false,
							},
							min: 10_000_000,
							// max: 100,
							ticks: {
								// forces step size to be 50 units
								stepSize: 100_000,
							},
						},
					
		},
		rc: {
			x: {
				display: false
			},
			y: {
				title: {
					display: false,
				},
				min: 3_000_000,
				// max: 100,
				ticks: {
					// forces step size to be 50 units
					stepSize: 100_000,
				},
			},
		
},
		represent: {
			x: {
				display: false
			},
			y: {
				title: {
					display: false,
				},
				min: 70,
				// max: 100,
				ticks: {
					// forces step size to be 50 units
					stepSize: 5,
				},
			},
		
},
	}

	const chartGetScales = (type) => {
		return chartScales[type]
	}

	const chartOptions = {
		responsive: true,
		aspectRatio: 1.5,
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
				},
			},
			scales: chartGetScales(chartType)
	};

	const fastChart = document.getElementById('fast');
	const middleChart = document.getElementById('middle');
	const normalChart = document.getElementById('normal');
	if (Chart.getChart(fastChart)){
		Chart.getChart(fastChart).destroy();
	}
	if (Chart.getChart(middleChart)){
		Chart.getChart(middleChart).destroy();
	}
	if (Chart.getChart(normalChart)){
		Chart.getChart(normalChart).destroy();
	}

	const fast = new Chart(fastChart, {
		type: 'bar',
		data: {
			labels: chartData.fast[chartType].labels,
			datasets: chartData.fast[chartType].datasets,
		},
		options: chartOptions,
	});
	const middle = new Chart(middleChart, {
		type: 'bar',
		data: {
			labels: chartData.middle[chartType].labels,
			datasets: chartData.middle[chartType].datasets,
		},
		options: chartOptions,
	});
	const normal = new Chart(normalChart, {
		type: 'bar',
		data: {
			labels: chartData.normal[chartType].labels,
			datasets: chartData.normal[chartType].datasets,
		},
		options: chartOptions,
	});
};
