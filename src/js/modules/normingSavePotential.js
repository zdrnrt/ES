// window.saveDataPotentialNorming = function () {
//     // Путь к файлу (относительно корня сайта)
//     // const filePath = './public/images/demo_file/id_potential.xlsx';
//     const filePath = 'https://raw.githubusercontent.com/Kujavia/ES/master/public/images/demo_file/id_potential.xlsx'

//     // Получаем текущую дату и время в формате `YYYY-MM-DD_HH-MM-SS`
//     const now = new Date();
//     const formattedDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

//     // Имя файла: `id_potential_YYYY-MM-DD_HHMMSS.xlsx`
//     const fileName = `id_potential_${formattedDateTime}.xlsx`;

//     // Создаем временную ссылку для скачивания
//     const link = document.createElement('a');
//     link.href = filePath;
//     link.download = fileName; // Указываем новое имя файла

//     // Добавляем ссылку в DOM (необходимо для Firefox)
//     document.body.appendChild(link);

//     // Программно кликаем по ссылке
//     link.click();

//     // Удаляем ссылку из DOM
//     document.body.removeChild(link);

//     // Обработка ошибок (необязательно)
//     link.onerror = function () {
//         console.error('Не удалось загрузить файл');
//         alert('Ошибка при загрузке файла. Файл не найден или путь указан неверно.');
//     };
// };

window.saveDataPotentialNorming = async function () {
    const fileUrl = 'https://raw.githubusercontent.com/Kujavia/ES/master/public/images/demo_file/id_potential.xlsx';
    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    const fileName = `id_potential_${formattedDateTime}.xlsx`;

    try {
        // Загружаем файл как Blob
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Файл не найден');
        const blob = await response.blob();

        // Создаем локальную ссылку для скачивания
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Освобождаем память
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось скачать файл. Проверьте консоль для подробностей.');
    }
};