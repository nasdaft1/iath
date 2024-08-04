var name_table = 'form-table';


/**
 * получение из глобальной переменной из cookes данные видимости блоков 
 * проверяет по id что выбрано в контексном меню при кликанье 
 * на таблицу с материалами
 * @param {String} key - ключ для получение видимый объект или нет 
 * @param {String} result_true - результат получаемый при true
 * @param {String} result_false - результат получаемый при false
 * @returns {String} Результат result_true || result_false 
 * в зависимости от даннх в хранилище
 */
function checkLocalTree(key, result_true, result_false){
    if (globalСonditionTree[String(key)] !=1){
            return result_true
        }
        else{
            return result_false
        }
}


/**
 * Для генерации таблицы из json
 * Функция для создания блоков div с классом table-theme рекурсивно
 * @param {Number}  depth - глубина дерева
 * @param {String}  id - идентификатор 
 * @param {String}  parent_id - идентификатор родителя
 * @param {String}  text - имя каталога или файла
 * @param {boolean} folder - true каталог, false фаил
 * @param {Number}  id_add - id элемента добавленного 
 */
function createDivBlocks(depth, id , parent_id, text, folder, id_add) {
    // Создать новый div с классом table-theme
    const div = document.createElement('div');
    div.className = 'table-theme';
    if (depth>0) {
        div.id = id; // назначаем идентификатор
        // получение из глобальной переменной из cookes данные видимости блоков
        div.style.display = checkLocalTree(id ,'none','flex')
    };
    // Назачение дополительного атрибута родительского id элементы
    div.setAttribute('id', id);
    div.setAttribute('parent_id', parent_id);
    div.setAttribute('depth', depth);
    div.setAttribute('folder', folder);
    // Создать элемент span
    const div_text = document.createElement('div');
    div_text.textContent = text;
    div_text.className = 'table-theme-text';
    // Добавить изображениЯ и span в div
    for (let i = 0; i <= depth; i++) {
        // Создать элемент изображения
        const img = document.createElement('img');
        img.className = 'table-theme-add';
        if ((i === depth) && (folder === true)) {
            // для рисование определение закрытого открытого каталога
            img.src = 'png/tree/tree-close.png';
        } else if ((i === depth) && (folder === false)) {
            img.src = 'png/tree/tree-clear.png';
        } else {
            img.src = 'png/tree/tree-line.png';
        };
        img.alt = 'Icon';
        div.appendChild(img);
    };
    div.appendChild(div_text);
    const divNew = document.createElement('div');
    div.appendChild(divNew);
    if (tree_focus.id_path_last ==id){
        div.setAttribute('data-color', 'select-element-changes')}
    if (tree_focus.id_path_last ==parent_id){
        div.setAttribute('data-color', 'select-area-changes')}
    if (id_add ==id && id_add!==null){
        div.setAttribute('data-color', 'select-element-add')}
    document.getElementById(name_table).appendChild(div);
};

/**
 * Функция для перебора JSON данных
 * Функция для создания блоков div с классом table-theme рекурсивно 
 * создание корневога каталога
 * @param {Object} obj - передача ссылкаи на клас содержащий метод итерации (счетчика)
 * @param {Number} depth - дла передачи и расчета глубины вложенности
 * @param {String} parent - для передачи id наследнику от родителя
 * @param {Array|null} id_path_last - Добавленный путь c id
 * @param {Number|null} id_add - Добавленный id при определенных действиях
 */
function iterateJSON(obj, depth, parent, id_path_last=null, id_add=null) {
    var element = document.getElementById(parent);
    let last_key; // для получение последнего id и уменьщения количество проверок
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            var id = obj[key]['#0#id'];
            var data = obj[key]['#1#folder'];
            last_key = id
            if (id_path_last===parent){
                // разворачивать дерево куда добавлен элемент
                globalСonditionTree[id]=1
            }
            if (data!==null) { 
                // каталог
                createDivBlocks(depth, id, parent, key, true, id_add);
                iterateJSON(data, depth + 1, id , id_path_last, id_add);
            } else {
                // файл
                createDivBlocks(depth, id, parent, key, false, id_add);
            };
        };
        // найти родителя и изменить мконку выпадающего списка
        if (globalСonditionTree[last_key] ===1 && parent>0){
            var elementImg = element.querySelectorAll('img');
            elementImg[depth-1].src = 'png/tree/tree-open.png'
        }
    };
};

/**
 * Функция для прохода по элементам блока и удалить навешанный атрибут
 * для подсветки модифицированных или измененых данных
 */
function clear_check(){
    // Получить элемент с id 'forma-table'
    var formaTable = document.getElementById('form-table');
    var divs = formaTable.getElementsByClassName('table-theme');
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        div.removeAttribute('data-color')
    }
}

/**
 * Функция задержки дя удаления посвеченных элементов
 */
function run_time(){
    setTimeout(() => {
        clear_check();
    }, 2200);
}


/**
 * Установка обработчика события, который будет вызван при получении ответа
 * @param {String} method - Настройка запроса: метод GET и URL
 * @param {String} url - URL запроса передаваемого на сервер
 * @param {Function} fun_data_load - функция передаваемая для обработки получаемых дянных
 * @param {Object} options = {} - для передачи атрибутов в fun_data_load
 */
function DataTree(load_response, options ={}){
    const id_path_last = options.id_path_last || null;
    document.getElementById('form-table').innerHTML = '';
    load_data=load_response['data'];
    iterateJSON(load_data['root']['#1#folder'],0, 
        load_data['root']['#0#id'], id_path_last,
        load_response['id_add'])
    // задержка для очистки от выделения
    run_time();
}



/**
 * Установка обработчика события, который будет вызван при получении ответа
 * @param {String} method - Настройка запроса: метод GET и URL
 * @param {String} url - URL запроса передаваемого на сервер
 * @param {Function} fun_data_load - функция передаваемая для обработки получаемых дянных
 * @param {Object} options = {} - для передачи атрибутов в fun_data_load
 */
function DataLoadSendApi(method, url, data, fun_data_load, options = {}){
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    // Обработчик ошибок
    // Устанавливаем заголовок Content-Type для отправки JSON
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onerror = function () {
        console.error('Произошла ошибка запроса.');
    };
    
    if (data !== undefined){     
        xhr.send(JSON.stringify(data))
    } else {
         xhr.send();
    }

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
        // Преобразование ответа в JSON
        var load_response = JSON.parse(xhr.responseText);
        fun_data_load(load_response, options)
        } else {
        console.error('Запрос не удался. Статус:', xhr.status);
        };
    }
}

/**
 * загрузка из json для дерева
 * @param {String} method - Настройка запроса: метод GET и URL
 * @param {String} url - URL запроса передаваемого на сервер
 * @param {Object} fun_data_load - передаваемые данные на сервер по дереву
 * @param {Array|null} id_path_last - передаваемые данные на сервер по дереву со списком 
 */
function fetchDataWithFetchAPI(method, url, data, id_path_last=null) {
    DataLoadSendApi(method, url, data, DataTree, {id_path_last: id_path_last})
};

// Вызов функции для загрузки данных при загрузки сайта 
document.addEventListener('DOMContentLoaded', () => {
    fetchDataWithFetchAPI('GET', 'http://213.178.34.212:18000/api/v1/tree/theme');
});