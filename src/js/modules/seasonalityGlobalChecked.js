export default window. saveSelectedGlobalParametersSeasonality = function() {
let currentData = JSON.parse(localStorage.getItem('globalParameters'));
if (!currentData) {
    currentData = {}; // Если нет, создаем новый объект
}
const seasonalityMethodElement = document.getElementById('seasonality_method');
// const seasonality_method = document.getElementById('seasonality_method').value;
const seasonality_method = seasonalityMethodElement.options[seasonalityMethodElement.selectedIndex].text;
currentData['сезонность'] = seasonality_method;
localStorage.setItem('globalParameters', JSON.stringify(currentData));
}
 