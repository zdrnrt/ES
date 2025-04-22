



//логика для чек-боксов

window.toggleAllCheckboxes = function (masterCheckbox) {
    // Выбираем только чекбоксы (исключаем радиокнопки и сам главный чекбокс)
    const checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]:not(#clusteringAll)');
    checkboxes.forEach(checkbox => {
        checkbox.checked = masterCheckbox.checked;
    });
}

window.handleChildCheckbox = function (childCheckbox) {
    const masterCheckbox = document.getElementById('clusteringAll');
    // Выбираем только чекбоксы (исключаем радиокнопки и главный чекбокс)
    const allCheckboxes = document.querySelectorAll('.form-check-input[type="checkbox"]:not(#clusteringAll)');
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);

    masterCheckbox.checked = allChecked;
}
window.toggleStratificationView = function (radio) {
    const stratContainer = document.querySelector('.clustering_strats');
    if (!stratContainer) return;

    const hideForIds = ['radioDBSCANClustering', 'radioKmeansClustering'];
    stratContainer.style.display =
        (hideForIds.includes(radio.id) || !radio.checked)
            ? 'none'
            : 'block'
}