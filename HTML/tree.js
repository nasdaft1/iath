var name_table = 'form-table';

function checkLocalTree(key, result_true, result_false){
    // key - ключ для получение видимый объект или нет 
    // result_true - результат получаемый при true
    // result_false - результат получаемый при false
    if (globalСonditionTree[String(key)] !=1){
            return result_true
        }
        else{
            return result_false
        }
    
}

// Для генерации таблицы из json
function createDivBlocks(depth, id , parent_id, text, folder) {
    // Функция для создания блоков div с классом table-theme рекурсивно
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
        // получение из глобальной переменной из cookes данные видимости блоков
        div.style.display = checkLocalTree(id ,'none','flex')
    };
    // Назачение дополительного атрибута родительского id элементы
    div.setAttribute('id', id);
    div.setAttribute('parent_id', parent_id);
    div.setAttribute('depth', depth);
    div.setAttribute('folder', folder);
    // Создать элемент span
    const span = document.createElement('span');
    span.textContent = text;
    span.className = 'table-theme-add';
    // Добавить изображениЯ и span в div
    for (let i = 0; i <= depth; i++) {
        // Создать элемент изображения
        const img = document.createElement('img');
        img.className = 'table-theme-add';
        if ((i === depth) && (folder === true)) {
            // для рисование определение закрытого открытого каталога
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
    const divNew = document.createElement('div');
    div.appendChild(divNew);
    if (tree_focus.id_path_last ==id){
        //div.style.transition ='background-color 3.3s ease 1s';
        div.style.backgroundColor ='yellow';
    }
    if (tree_focus.id_path_last ==parent_id){
        //div.style.transition ='background-color 3.3s ease 1s';
        div.style.backgroundColor ='red';
    }
    document.getElementById(name_table).appendChild(div);
    /*if (tree_focus.id_path_last ==id){
        xx = document.getElementById('id')
        //div.style.transition ='background-color 3.3s ease';
        //div.style.backgroundColor ='red';
    }*/
    
};


// Функция для перебора JSON данных
function iterateJSON(obj, depth, parent, indent = '', id_path_last=null) {
    // incrementer: передача ссылкаи на клас содержащий метод итерации (счетчика)
    // depth: дла передачи и расчета глубины вложенности
    // parent: для передачи id наследнику от родителя
    // создание корневога каталога
    
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
            //console.log('id_path_last',id_path_last, parent, id, key)
            if (data!==null) { 
                // каталог
                createDivBlocks(depth, id, parent, key, true);
                iterateJSON(data, depth + 1, id , indent + ' ', id_path_last);
            } else {
                // файл
                createDivBlocks(depth, id, parent, key, false);
            };
        };
        // найти родителя и изменить мконку выпадающего списка
        if (globalСonditionTree[last_key] ===1 && parent>0){
            var elementImg = element.querySelectorAll('img');
            elementImg[depth-1].src = 'png/tree-open.png'
        }
    };
};

// загрузка из json
function fetchDataWithFetchAPI(method, url, data, id_path_last=null) {
    // const incrementer = new Incrementer(); // инициализация счетчика
    // const boundIncrementMethod = incrementer.getIncrementMethod(); //функции с передачей контекста
    var xhr = new XMLHttpRequest();
    // Установка обработчика события, который будет вызван при получении ответа
    // Настройка запроса: метод GET и URL
    xhr.open(method, url, true);
    // Обработчик ошибок
    // Устанавливаем заголовок Content-Type для отправки JSON
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onerror = function () {
        console.error('Произошла ошибка запроса.');
    };
    // Отправка запроса
    if (data !== undefined){
        // console.log('отправлено= ',data)
        data_send = JSON.stringify(data) //для теста 
        // console.log('отправлено=> ',data_send) //для теста
        xhr.send(data_send)
    } else {
        console.log('отправлено запрос без данных')
        xhr.send();
    }

    xhr.onload = function () {
        console.log(xhr.status)
        if (xhr.status >= 200 && xhr.status < 300) {
            // Преобразование ответа в JSON
            var load_data = JSON.parse(xhr.responseText);
            // очистак внутри блока перед загрузкой и формированием    
            document.getElementById('form-table').innerHTML = '';
            console.log('загрузить данные в дерево');
            iterateJSON(load_data['root']['#1#folder'],0, 
                load_data['root']['#0#id'], '', id_path_last)
        } else {
            console.error('Запрос не удался. Статус:', xhr.status);
        };
    };

};


document.addEventListener('DOMContentLoaded', () => {
    // Вызов функции для загрузки данных
    fetchDataWithFetchAPI('GET', 'http://213.178.34.212:18000/api/v1/tree/theme');
});