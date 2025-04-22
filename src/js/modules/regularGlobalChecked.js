export default window.saveGlobalParametersRegular = function () {
    let currentData = JSON.parse(localStorage.getItem('globalParameters'));
    if (!currentData) {
        currentData = {}; // Если нет, создаем новый объект
    }
    const regularAssortMethodForecast = document.getElementById('regular_assort_method');
    // const seasonality_method = document.getElementById('seasonality_method').value;
    const regular_method = regularAssortMethodForecast.options[regularAssortMethodForecast.selectedIndex].text;
    currentData['методы прогноза'] = regular_method;
    localStorage.setItem('globalParameters', JSON.stringify(currentData));
}