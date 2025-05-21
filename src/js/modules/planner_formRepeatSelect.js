export default window.planner_formRepeatSelect = function() {
    const intervalSelect = document.getElementById('planner_intervalRepetition__header');
    const dayOfWeekParagraph = document.querySelector('.planner_visionParagraphDayOfWeek');
    const dayOfWeekSelect = document.getElementById('planner_dayOfWeekRepeat');
    const intervalWrapperDay = document.querySelector('.planner_intervalWrapperDay');
    const dayAndWeekMonth = document.getElementById('dayAndWeekMonth');  
    const planner_dayNumber = document.getElementById('planner_dayNumber'); 
    const empty = document.getElementById('empty'); 
    const select_ModalPlannerMonthlyDay = document.querySelector('.select_ModalPlannerMonthlyDay');
    
     
    

    const selectedValue = intervalSelect.value;

    if  (selectedValue === 'monthly') {
        dayOfWeekParagraph.style.display = 'block';
        dayOfWeekSelect.style.display = 'none';
        intervalWrapperDay.textContent = 'месяц';
        dayAndWeekMonth.style.display = 'block';
        planner_dayNumber.style.display = 'block';
        select_ModalPlannerMonthlyDay.style.display = 'flex';
        empty.style.display = 'none';
    }else if (selectedValue === 'weekly') {
        dayOfWeekParagraph.style.display = 'block';
        dayOfWeekSelect.style.display = 'block';
        intervalWrapperDay.textContent = 'неделя';
        dayAndWeekMonth.style.display = 'none';
        planner_dayNumber.style.display = 'none';
        select_ModalPlannerMonthlyDay.style.display = 'none';
        empty.style.display = 'none';
    } else if (selectedValue === 'daily') {
        dayOfWeekParagraph.style.display = 'none';
        dayOfWeekSelect.style.display = 'none';
        intervalWrapperDay.textContent = 'день';
        dayAndWeekMonth.style.display = 'none';
        planner_dayNumber.style.display = 'none';
        select_ModalPlannerMonthlyDay.style.display = 'none';
    }
}

// Инициализация при загрузке страницы
// document.addEventListener('DOMContentLoaded', function() {
//     planner_formRepeatSelect();
// });

