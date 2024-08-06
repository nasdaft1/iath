var context_menu_heigh;

/**+
 * Класс для обработки объектов и хранения связанных с таблицей материалы
 */
class MaterialFocus{
    id_select = null // элемента выбранного в дереве для открытия в материалах
    id_row = null  // id радя в таблице выделенной
    row_buffer = null // буфер строки 

    /**+
     * Передача на хранения и обработки выбранного файла открытого в материалах
     */
    setSelect(id){
        if (typeof this.id_select !== 'undefined' && this.id_select !== null){
            const targetDiv = document.getElementById(this.id_select);
            targetDiv.classList.remove('selected');
        } else {
        }
        this.id_select =id;
    }
    
    /**+
     * Внесение id ряда таблицы материалов
     */
    setSelectRow(id){
        this.id_row=id
    }

    /**+
     * Получение id строки материалов
     * @returns {String} - id радя в таблице выделенной
     */
    getSelectRow(){
        return this.id_row
    }

    /**+
     * Запись в буфер строки с данными
     * @returns {Object|null} - строка находящаяся в буфере | null если пустой
     */
    setBufferRow(row_data){
        this.row_buffer=row_data
    }

    /**+
     * Чтение из буфера строки с данными
     * @returns {Object|null} - строка находящаяся в буфере | null если пустой
     */
    getBufferRow(){
        return this.row_buffer
    }

    /**+
     * Очистка из буфера строки с данными
     */
    clearBufferRow(){
        this.row_buffer=null
    }

}

/**+
 * Класс для выставление выделение на дереве
 */    
class TreeFocus {
    id_path=[] //путь для выбранного элемента
    id_path_buffer=[] // путь до копируемого элемента
    method = ''
    url = ''
    id_path_last = null
    id_add = null // элемент добавленнный или измененный

    /**+
     * Выставление выделение на tree, без атрибутов сбрасывается в дефолт
     * @param {Object} element - для закрытия поля 'close_input'
     * @param {Array} id_path - для закрытия поля 'close_input'
     */    
    setFocus(element=undefined, id_path=[]) {
        if (element!==undefined) {
            this.id = element.id;
            if (this.id === 'folder_root'){
                this.id_path_last = 0
            } else{
                this.id_path_last = Number(element.id);    
            }
            this.targetDiv = document.getElementById(element.id);
            this.targetDiv.style.outline = "var(--tree-select-outline)";
            var clear_bag = document.getElementById('form-table');
            //clear_bag.style.backgroundColor = 'var(--tree-background)'
        } else {
            this.id = undefined; // дефолтное значение
        }
        this.id_path = id_path
    };

    /**+
     * Удаление выделение на tree
     */    
    deleteFocus() {
        if (this.id !== undefined){
            this.targetDiv = document.getElementById(this.id);
            var clear_bag = document.getElementById('form-table');
            if (this.targetDiv !== null) {
                this.targetDiv.style.outline = 'none';
                // для того чтобы убрать артифакты
                clear_bag.style.backgroundColor = 'var(--tree-background1)'
            }
        };
    };

    
    /**+
     * Функция копирования пути в буффер пути
     */
    copy_in_buffer(){
        this.id_path_buffer=this.id_path
        console.log('id_path_buffer=',this.id_path_buffer)
    }
    
    /**+
     * Передача данных для временного хранения URL и метода для 
     * отправки на сервер собития после даполнениения поля ввода
     * @param {String} method - метод отправки данных на сервер
     * @param {String} url - URL путь для отправки данных на сервер
     */
    setEnterTreeInput(method, url){
        this.method = method;
        this.url = url;
    }

    /**
     * Функция для обработки кликнули на дерево на файл или каталог
     * Найти нужный элемент если кликнули по наследнику 
     * @param {Object} name - для закрытия поля 'close_input'
     */
    sendDataEnter(name){
        if (this.method!=='' && this.url!=='' && name!==null){
            console.log('this.id_path',this.id_path,)
            console.log('this.id_path_last',this.id_path_last)
            fetchDataWithFetchAPI(this.method,
                this.url, 
                {"id_path":this.id_path, 'name': name},
                this.id_path_last // для раскрытия списка при добавлении
            );
        // нужно добавтить обработку 
        } else {
            console.error("Method, URL, or name is not properly set.");
        }
    }
};


// Пример использования
const tree_focus = new TreeFocus();
const material_focus = new MaterialFocus();

/**+
 * Функция закрытия констектного меню
 */
function close_context_menu(){
    var element_menu = document.getElementById("contextMenu") 
    element_menu.style.display = 'none';
};


/**+
 * Функция для обработки кликнули на дерево на файл или каталог
 * меняется путь от иконки (открытый каталог) в каталоге и проводится по ветке делая видимой
 * @param {Object} targetDiv - блок каталога который обрабатывается
 * @param {Object} depth - глубина дерева
 * @param {Object} iconImg - список с иконками в каталоге
 * @param {Number} index_icon - индекс где расположена иконка
 */
function open_tree(targetDiv, depth, iconImg, index_icon){
    // Если элемент найден, обработать все следующие элементы
    var nextElement = targetDiv.nextElementSibling;
    // Проходить по всем следующим элементам и делать их видимыми
    iconImg[index_icon].src = 'png/tree/tree-open.png'; // Укажите новый URL иконки 
    while (nextElement) {
        var nextDepth=Number(nextElement.getAttribute('depth'));
        if (nextDepth===depth){break;}
        if (nextDepth === (depth +1)){
            nextElement.style.display = 'flex';
            // передать в глабальную переменную состояние видимости дерева
            globalСonditionTree[String(nextElement.id)]= 1
        };
        nextElement = nextElement.nextElementSibling;
    };
};


/**+
 * Функция для обработки кликнули на дерево на файл или каталог
 * меняется путь от иконки в каталоге (закрытый каталог) и проводится по ветке делая не видимой
 * @param {Object} targetDiv - блок каталога который обрабатывается
 * @param {Object} depth - глубина дерева
 * @param {Object} iconImg - список с иконками в каталоге
 * @param {Number} index_icon - индекс где расположена иконка
 */
function close_tree(targetDiv, depth, iconImg, index_icon){
    // Для сворачивания участка дерева 
    var nextElement = targetDiv.nextElementSibling;
    // Проходить по всем следующим элементам и делать их видимыми
    iconImg[index_icon].src = 'png/tree/tree-close.png'; // Укажите новый URL иконки 
    while (nextElement) {
        var nextDepth=Number(nextElement.getAttribute('depth'));
        if (nextDepth<=depth){break;};
        var iconImgNext = nextElement.querySelectorAll('img');
        var iconImgLength = iconImgNext.length -1;
        var iconTextNext = iconImgNext[iconImgLength].src.slice(-13)
        if (iconTextNext ==='tree-open.png'){
            iconImgNext[iconImgLength].src = 'png/tree/tree-close.png';
        };
        nextElement.style.display = 'none'; // отключаем видимость
        // передать в глабальную переменную состояние не видимости дерева
        delete globalСonditionTree[String(nextElement.id)]
        nextElement = nextElement.nextElementSibling;
    };
};

/**+
 * Функция для определение открыт каталог или закрыт и
 * в соотвествие с этим выполнять открытие или закрытие
 * на основание пути к иконке расположенной в каталоге
 * @param {Object} targetDiv - блок каталога который обрабатывается
 * @param {Object} depth - глубина дерева
 * @param {Object} iconImg - список с иконками в каталоге
 * @param {Number} index_icon - индекс где расположена иконка
 */
function check_img(targetDiv, depth, iconImg, index_icon){
    // Определить нужное действие сворачивание или разворачивание
    // все зависит от картинки блока по которому кликнули
    var text = iconImg[index_icon].src.slice(-14);
    if (text === 'tree-close.png') {
        open_tree(targetDiv, depth, iconImg, index_icon);
    } else if (text === 'tree-clear.png') {
    } else {
        close_tree(targetDiv, depth, iconImg, index_icon);
    };
};


/**+
 * Функция для обработки кликнули на дерево на файл или каталог
 * При кликанье на каталог производится сворачивание или разворачивание дерева
 * При кликанье на файл производится загрузка с сервера данных с контентом
 * @param {Object} div - для закрытия поля 'close_input'
 */
function open_click(div){
    var targetDiv = document.getElementById(div.id);
    var depth = Number(targetDiv.getAttribute('depth'));
    var folder = targetDiv.getAttribute('folder');
    if ((targetDiv) && (folder ==='true')) {
        // обрабатывается если кликнули на каталог дерева
        console.log('каталог');
        var iconImg = targetDiv.querySelectorAll('img');
        check_img(targetDiv, depth, iconImg, iconImg.length-1);
        
    } else {
        // обрабатывается если кликнули на файл дерева
        // добавляется для выделения элемента дерева        
        targetDiv.classList.add('selected');
        // установка в класс для памяти выбранного элемента
        material_focus.setSelect(targetDiv.getAttribute('id'))
        fetchDataMaterialAPI('POST', 'http://213.178.34.212:18000/api/v1/material/read')
    }
};

/**+
 * Функция закрытия поля ввода данных на дереве
 * @param {String} element_id - для закрытия поля 'close_input'
 */
function close_input_element(){
    var targetDiv = document.getElementById("search_menu");
    targetDiv.style.visibility = "hidden";
    document.getElementById("tree_input").value = '';
    tree_focus.deleteFocus();
}

/**+
 * Функция закрытия поля ввода данных на дереве в зависимости от переданного атрибута
 * @param {String} element_id - для закрытия поля 'close_input'
 */
function close_input(element_id) {
    console.log("Закрыть поиск",element_id);
    if (element_id==="close_input") {
        close_input_element();
    }
}

/**+
 * Рекурсивная функция для нахождения пути до корневого элемента
 * @param {String} id - ключ от какого длеать список id[] до главного родителя
 * @returns {Array} Список ключей от передоваемого до главного родителя
 */
function findPathToRoot(id) {
    const path = [];
    if (id ==='folder_root'){
        return [0] // для обработки root каталога   
    }
    let currentElement = document.getElementById(id);
    while (currentElement) {
        path.push(parseInt(currentElement.id));
        parent_id = currentElement.getAttribute('parent_id')
        currentElement = document.getElementById(parent_id);
    }
    path.push(0);
    return path.reverse();
}


/**+
 * Расчет местоположение и раскрытие контекстного меню при нажатие правой кнопки мыши
 * @param {Object} element - объект на который произведен клик мыши
 * @param {Event} event - событие передаваемое для отследивание курсора мыши
 * @returns {Array} Список ключей от передоваемого до главного родителя
 */
function get_path_tree_focus(element, event){
    const index = element.id
    // Получить высоту окна браузера
    const windowHeight = window.innerHeight;
    const menu = document.getElementById("contextMenu") 
    const pathToRoot = findPathToRoot(index);
    tree_focus.setFocus(element, pathToRoot)
    menu.style.left = (event.clientX) + "px";
    // чтобы контекстное меню не выползало из экрана
    if ((context_menu_heigh +event.clientY+30)< windowHeight){
        menu.style.top = (event.clientY -30) + "px";
    } else {
        menu.style.top = (event.clientY -50-context_menu_heigh) + "px";
    }
    document.getElementById("block_menu_cont").style.display='block'
    document.getElementById("block_menu_material").style.display='none'
    menu.style.display = 'block';
    return pathToRoot
}

/**
 * Рекурсивная функция для нахождения пути до корневого элемента
 * @param {String} element - ключ от какого длеать список id[] до главного родителя
 * @param {String} event - ключ от какого длеать список id[] до главного родителя
 * @returns {Number} Список ключей от передоваемого до главного родителя
 */
function get_path_material_focus(element, event){
    // обработка если было кликнуто правой кнопкой мыши на таблицу материалов
    // index- id элемента по которому кликнули
    const index = element.id
    // Получить высоту окна браузера
    const windowHeight = window.innerHeight;
    const menu = document.getElementById("contextMenu") 
    menu.style.left = (event.clientX) + "px";
    // чтобы контекстное меню не выползало из экрана
    if ((context_menu_heigh +event.clientY+30)< windowHeight){
        menu.style.top = (event.clientY -30) + "px";
    } else {
        menu.style.top = (event.clientY -50-context_menu_heigh) + "px";
    }
    document.getElementById("block_menu_cont").style.display='none'
    document.getElementById("block_menu_material").style.display='block'
    menu.style.display = 'block';
    console.log('get_path_material_focus', index);
    material_focus.setSelectRow(index)
    return 2 //pathToRoot
}



/**+
 * Для определения соответсвия id родителя или наследника по кому было кликну
 * @param {Function} func - функция вызываемая 
 * @param {Object} element - элемент на который основной
 * @param {Object} parent_element - элемент родитель
 * @param {String} value - значение элемента для сравнения
 * @param {event} event - событие передаваемое в функцию если есть
 * @returns {any|null} - резултат пеедаваемой функции в функцию
 */
function check_run(func, element, parent_element, value, event){
    if (element.className === value){
        return func(element, event)
    }
    else if (parent_element.className === value){
        return func(parent_element, event)
    }
    else {return null}
};

/* Расчет выползания контекстного меню
 * Предотвращаем появление контекстного меню по умолчанию
 */
document.addEventListener('contextmenu', function (event) {
    tree_focus.deleteFocus(); // удаление выделение по многочисленным кликам 
    event.preventDefault();
    // Получаем элемент, на который кликнули
    var clickedElement = event.target;
    // Получаем родительский элемент
    var parentElement = clickedElement.parentElement;
    // Проверяем клик был на нужном нам элементе?
    try{

        if (check_run(get_path_tree_focus, clickedElement, parentElement, "table-theme", event)||
            check_run(get_path_tree_focus, clickedElement, parentElement, "cell-menu", event)||
            check_run(get_path_material_focus, clickedElement, parentElement, "row-material", event)
        ) {} else {
            // закрываем контекстное меню если производится попытка открыть
            // вне области применения
            close_context_menu();
            close_input_element();
        };
    }catch (error) {console.log('Error:',error)};

});

/**+
 * Функция, которая будет вызываться при клике правой кнопке на весь сайт
 * Проверяем, что клик был левой кнопкой мыши
 * @param {Object} event - объект передаваемый при событии
 */
function handleClick(event) {
    try{
        if (event.button === 0) {
            // Получаем элемента на который кликнули
            var element = event.target;
            // Получаем родительский элемент
            var parent_element = element.parentElement;
            // Выводим id в консоль
            chech_click_material(element);//проверка клиса на таблицу материалы
            check_run(open_click, element, parent_element, 'table-theme');
            check_run(menu_click, element, parent_element, 'menu-cont');
            check_run(material_click, element, parent_element, 'menu-material');
            /*if (parent_element.id==="search_menu"){
                close_input(element.id); // закрытие input
            }*/
            close_context_menu();
        };
    }catch (error) {};
};

/**+
 * Функция, которая будет вызываться при клике правой кнопке на весь сайт
 * Проверяем, что клик был левой кнопкой мыши
 * @param {Object} event - объект передаваемый при событии
 */
function tree_input_handle_Key(event) {
    // обработка нажатия на поле input
    if (event.key === 'Enter' || event.keyCode === 13) {
        const input_text = event.target.value
        close_input_element();
        tree_focus.sendDataEnter(input_text);
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
        close_input_element();
    }
}

// Добавляем обработчик событий клик для всего документа
document.addEventListener('click', handleClick);

// отключение вспывающего меню по ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        console.log('Esc key was pressed');
        // скрытие контекстного меню
        close_context_menu();
        tree_focus.deleteFocus();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // высота контекстного меню 
    var context_menu_element=document.getElementById("contextMenu");
    var context_menu_heigh_str=window.getComputedStyle(context_menu_element).height;
    context_menu_heigh = parseInt(context_menu_heigh_str, 10) // в число
    const tree_input = document.getElementById('tree_input');
    tree_input.addEventListener('keyup', tree_input_handle_Key);
});
