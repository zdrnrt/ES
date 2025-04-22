export default window.saveSelectedGlobalParameters = function () {
    window.check_mark = function () {
        const statusElement = document.getElementById('check-mark_button');
        statusElement.style.display = 'inline';
        setTimeout(function () {
            statusElement.style.display = 'none';
        }, 5000);
    }
    window.check_mark()

    const parameters = {};
    const parametersBefore = {};

    // Получаем значения из селектов
    const timeAggregation = document.getElementById("parameters_aggregation-time");
    const skuAggregation = document.getElementById("parameters_aggregation-scu");
    const oosMethod = document.getElementById("parameters_oos-method");
    const promoMethod = document.querySelector('input[name="flexRadioDefaultPromo"]:checked');
    const spikesMethod = document.querySelector('input[name="flexRadioDefaultSpikes"]:checked');
    const selectedTextOOS = document.querySelector('input[name="flexRadioDefaultOOS"]:checked');
    const salesRecoveryMethod = document.querySelector('input[name="flexRadioDefaultRecovery"]:checked');

    // Находим все радио-кнопки с именем 'flexRadioDefaultOOS'
    const radioButtons = document.querySelectorAll('input[name="flexRadioDefaultOOS"]');
    // Находим выбранную радио-кнопку
    ////const selectedRadio = Array.from(radioButtons).find(radio => radio.checked);
    // Получаем текст выбранной радио-кнопки
    //const selectedValueOOS = selectedRadio.value;

    const labelpromoMethod = document.querySelector(`label[for="${promoMethod.id}"]`);
    const labelspikesMethod = document.querySelector(`label[for="${spikesMethod.id}"]`);
    const labelselectedTextOOS = document.querySelector(`label[for="${selectedTextOOS.id}"]`);
    const labelsalesRecoveryMethod = document.querySelector(`label[for="${salesRecoveryMethod.id}"]`);

    // Сохраняем текстовые значения в объект

    parameters['очистка от промо'] = labelpromoMethod.textContent.trim();
    parameters['очистка от выбросов'] = labelspikesMethod.textContent.trim();
    parameters['очистка oos'] = labelselectedTextOOS.textContent.trim();
    parameters['восстановление'] = labelsalesRecoveryMethod.textContent.trim();

    parameters['агрегат по времени'] = timeAggregation.options[timeAggregation.selectedIndex].text;
    parameters['агрегат по позиции'] = skuAggregation.options[skuAggregation.selectedIndex].text;
    //parameters['очистка oos'] = oosMethod.options[oosMethod.selectedIndex].text;




    // Сохраняем id и value выбранных селектов в объект в формате { id: value }
    parametersBefore[timeAggregation.id] = timeAggregation.value;
    parametersBefore[skuAggregation.id] = skuAggregation.value;
    //parametersBefore[oosMethod.id] = oosMethod.value;
    parametersBefore[oosMethod.id] = selectedTextOOS;
    parametersBefore[promoMethod.id] = promoMethod.value;
    parametersBefore[spikesMethod.id] = spikesMethod.value;
    parametersBefore[salesRecoveryMethod.id] = salesRecoveryMethod.value;

    // Сохраняем объект в localStorage как строку JSON
    localStorage.setItem('globalParameters', JSON.stringify(parameters));
    localStorage.setItem('globalParametersNewProducts', JSON.stringify(parameters));
    localStorage.setItem('globalParametersPromo', JSON.stringify(parameters));
    localStorage.setItem('globalParametersSummaryPlan', JSON.stringify(parameters));
    localStorage.setItem('globalParametersBefore', JSON.stringify(parametersBefore));

    // Выводим сообщение о сохранении
    console.log('Параметры сохранены в двух словарях:', parameters);
}
