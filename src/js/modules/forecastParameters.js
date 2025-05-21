// window.showContent_regular_assort = function() {
//     fetch('./src/html/forecastParameters.html')
//         .then(response => {
//             // Проверяем, успешно ли выполнен запрос
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.text(); // Преобразуем ответ в текст
//         })
//         .then(html => {
//             // Вставляем загруженный HTML в контейнер maincontent
//             document.getElementById('content').innerHTML = html;
//         })
//         .catch(error => {
//             console.error('There has been a problem with your fetch operation:', error);
//         });
//   }

//   import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Popover from 'bootstrap/js/dist/popover';

window.showContent_parameters = function () {
    const mainContent = document.getElementById('content');
    fetch('./src/html/forecastParameters.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Модуль не отвечает');
            }
            return response.text();
        })
        .then(data => {
            // Вставляем загруженный HTML в mainContent
            mainContent.innerHTML = data;
  
            // Загружаем сохранённые параметры
            loadSelectedGlobalParametersBefore();
  
            // Инициализируем Popover для динамически загруженных элементов
            initializePopovers();
  
            // Инициализируем иконки (если необходимо)
            initializeIcons();
        })
        .catch(error => {
            console.error('Ошибка при загрузке файла:', error);
            mainContent.innerHTML = 'Ошибка при загрузке';
        });
  
    // Функция для загрузки сохранённых параметров
  window.loadSelectedGlobalParametersBefore =   function() {
        const parametersBefore = JSON.parse(localStorage.getItem('globalParametersBefore'));
        if (parametersBefore) {
            for (const id in parametersBefore) {
                const selectElement = document.getElementById(id);
                if (selectElement) {
                    selectElement.value = parametersBefore[id];
                }
            }
        }
    }
  
    // Функция для инициализации Popover
    window.initializePopovers = function() {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        popoverTriggerList.forEach(popoverTriggerEl => {
            new Popover(popoverTriggerEl); // Используем импортированный Popover
        });
    };
  
    // Функция для инициализации иконок
    window.initializeIcons= function() {
        const iconElements = [].slice.call(document.querySelectorAll('svg use'));
        iconElements.forEach(function (iconEl) {
            const href = iconEl.getAttribute('xlink:href');
            if (href && !document.querySelector(href)) {
                console.warn(`Иконка ${href} не найдена в DOM`);
            }
        });
    }
  };
  