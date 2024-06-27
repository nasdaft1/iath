var name_table = 'form-table';


// Для генерации таблицы из json
// Функция для создания блоков div с классом table-theme рекурсивно
function createDivBlocks(depth, id , parent_id, text, folder) {
    // depth - глубина дерева
    // id - идентификатор 
    // parent_id - идентификатор родителя
    // text - имя каталога или файла
    // folder - true каталог, false фаил
    // Создать новый div с классом table-theme
    const div = document.createElement('div');
    div.className = 'table-theme';
    if (depth>0) {
        div.id = id; // назначаем идентификатор
        div.style.display = 'none'; // отключаем видимость
    };
    // Назачение дополительного атрибута родительского id элементы
    div.setAttribute('id', id);
    div.setAttribute('parent_id', parent_id);
    div.setAttribute('depth', depth);
    div.setAttribute('folder', folder);
    // Создать элемент span
    const span = document.createElement('span');
    span.textContent = text;
    // Добавить изображение и span в div
    for (let i = 0; i <= depth; i++) {
        // Создать элемент изображения
        const img = document.createElement('img');
        if ((i === depth) && (folder === true)) {
            img.src = 'png/tree-close.png';
        } else if ((i === depth) && (folder === false)) {
            img.src = 'png/tree-clear.png';
        } else {
            img.src = 'png/tree-line.png';
        };
        img.alt = 'Icon';
        div.appendChild(img);
    };
    div.appendChild(span);
    // Добавить div в контейнер
    document.getElementById(name_table).appendChild(div);
};


// Функция для перебора JSON данных

// function iterateJSON(obj, incrementer, depth, parent, indent = '') {
function iterateJSON(obj, depth, parent, indent = '') {
    // incrementer: передача ссылкаи на клас содержащий метод итерации (счетчика)
    // depth: дла передачи и расчета глубины вложенности
    // parent: для передачи id наследнику от родителя
    // создание корневога каталога
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // var id = incrementer();
            var id = obj[key]['#0#id'];
            var data = obj[key]['#1#folder'];
            if (data!==undefined) {
                createDivBlocks(depth, id, parent, key, true);
                iterateJSON(data, depth + 1, id , indent + '  ');
            } else {
                createDivBlocks(depth, id, parent, key, false);
            };
        };
    };
};

// загрузка из json
function fetchDataWithFetchAPI() {
    // const incrementer = new Incrementer(); // инициализация счетчика
    // const boundIncrementMethod = incrementer.getIncrementMethod(); //функции с передачей контекста
    const url = 'http://213.178.34.212:18000/api/theme';
    var xhr = new XMLHttpRequest();
    // Установка обработчика события, который будет вызван при получении ответа
    xhr.onload = function () {
        console.log(xhr.status)
        if (xhr.status >= 200 && xhr.status < 300) {
            // Преобразование ответа в JSON
            var data = JSON.parse(xhr.responseText);
            // iterateJSON(data, boundIncrementMethod, 0, 0)
            iterateJSON(data, 0, 0)
        } else {
            console.error('Запрос не удался. Статус:', xhr.status);
        };
    };
    // Настройка запроса: метод GET и URL
    xhr.open('GET', url, true);
    // Обработчик ошибок
    xhr.onerror = function () {
        console.error('Произошла ошибка запроса.');
    };
    // Отправка запроса
    xhr.send();
};


document.addEventListener('DOMContentLoaded', () => {
    // Вызов функции для загрузки данных
    fetchDataWithFetchAPI();
});