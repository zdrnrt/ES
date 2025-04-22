window.forecastOpen = function () {
    fetch('./src/html/forecast.html')
        .then(response => {
            // Проверяем, успешно ли выполнен запрос
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text(); // Преобразуем ответ в текст
        })
        .then(html => {
            // Вставляем загруженный HTML в контейнер maincontent
            document.getElementById('content').innerHTML = html;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

window.openModalOptRA = function () {
    document.getElementById('modalOptRegAss').style.display = 'block';
}

window.closeModalOptRA = function () {
    document.getElementById('modalOptRegAss').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('modalOptRegAss');
    if (event.target === modal) {
        closeModalOptRA();
    }
}

// модалка методы прогноза
window.openModal_MethodForecastRA = function () {
    document.getElementById('modalMethodForecastRegAss').style.display = 'block';
}

window.closeModal_MethodForecastRegAss = function () {
    document.getElementById('modalMethodForecastRegAss').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('modalMethodForecastRegAss');
    if (event.target === modal) {
        closeModal_MethodForecastRegAss();
    }
}

///сохранение метода из модалки
window.saveForecastMethodFromModal = function () {
    const selectedRadio = document.querySelector('input[name="radioModalMethodForecast"]:checked');

    if (selectedRadio) {
        const label = document.querySelector(`label[for="${selectedRadio.id}"]`);

        if (label) {
            document.getElementById('regular_assort_method').value = label.textContent;
        }
    }

    closeModal_MethodForecastRegAss();
}