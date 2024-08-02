var context_menu_heigh;





class TreeFocus {
    id_path=[] //путь для выбранного элемента
    id_path_buffer=[] // путь до копируемого элемента
    method = ''
    url = ''
    id_path_last = null
    id_add = null // элемент добавленнный или измененный

    setFocus(element=undefined, id_path=[]) {
        // выставление выделение на tree
        // Без атрибутов сбрасывается в дефолт
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

    
    deleteFocus() {
        // удаление выделение на tree
        if (this.id !== undefined){
            //console.log('deleteFocus()',this.id)
            this.targetDiv = document.getElementById(this.id);
            var clear_bag = document.getElementById('form-table');
            // console.log(clear_bag)    
            if (this.targetDiv !== null) {
                this.targetDiv.style.outline = 'none';
                // для того чтобы убрать артифакты
                clear_bag.style.backgroundColor = 'var(--tree-background1)'
            }
        };
    };

    copy_in_buffer(){
        // копирования пути в буффер пути
        this.id_path_buffer=this.id_path
        console.log('id_path_buffer=',this.id_path_buffer)
    }
    
    setEnterTreeInput(method, url){
        this.method = method;
        this.url = url;
        //console.log('method', this.method)
        //console.log('url',this.url)
    }

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


function close_context_menu(){
    // Закрытие констектного меню
    var element_menu = document.getElementById("contextMenu") 
    element_menu.style.display = 'none';
};

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

function open_click(div){
    // Найти нужный элемент если кликнули по наследнику
    var targetDiv = document.getElementById(div.id);
    var depth = Number(targetDiv.getAttribute('depth'));
    var folder = targetDiv.getAttribute('folder');
    if ((targetDiv) && (folder ==='true')) {
        var iconImg = targetDiv.querySelectorAll('img');
        check_img(targetDiv, depth, iconImg, iconImg.length-1);
        
    };
};

function close_input_element(){
    var targetDiv = document.getElementById("search_menu");
    targetDiv.style.visibility = "hidden";
    document.getElementById("tree_input").value = '';
    tree_focus.deleteFocus();
}

function close_input(element_id) {
    // проверка закрытие поле input по Х и очитава от введеных данных
    console.log("Закрыть поиск",element_id);
    if (element_id==="close_input") {
        close_input_element();
    }
}


function findPathToRoot(id) {
    // Рекурсивная функция для нахождения пути до корневого элемента
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
    console.log('pathToRoot',pathToRoot)
    return pathToRoot
}


function get_path_material_focus(element, event){
    const index = element.id
    // Получить высоту окна браузера
    const windowHeight = window.innerHeight;
    const menu = document.getElementById("contextMenu") 
    //const pathToRoot = findPathToRoot(index);
    //tree_focus.setFocus(element, pathToRoot)
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
    console.log('get_path_material_focus');
    //console.log('pathToRoot',pathToRoot)
    return 1 //pathToRoot
}




function check_run(func, element, parent_element, value, event){
    // func - функция вызываемая 
    // element - элемент на который основной
    // parent_element - элемент родитель
    // value - значение элемента для сравнения
    // event -событие передаваемое в функцию если есть
    // Выполнение функции c элемент или родитель который соответствует value
    if (element.className === value){
        return func(element, event)
    }
    else if (parent_element.className === value){
        return func(parent_element, event)
    }
    else {return null}
};


document.addEventListener('contextmenu', function (event) {
    // расчет выползания контекстного меню
    // Предотвращаем появление контекстного меню по умолчанию
    tree_focus.deleteFocus(); // удаление выделение по многочисленным кликам 
    event.preventDefault();
    // Получаем элемент, на который кликнули
    var clickedElement = event.target;
    // Получаем родительский элемент
    var parentElement = clickedElement.parentElement;
    // Проверяем клик был на нужном нам элементе?

    console.log('c',clickedElement.className);
    console.log('p',parentElement.className);
    //try{

        if (check_run(get_path_tree_focus, clickedElement, parentElement, "table-theme", event)||
            check_run(get_path_tree_focus, clickedElement, parentElement, "cell-menu", event)||
            check_run(get_path_material_focus, clickedElement, parentElement, "row-material", event)
        ) {} else {
            // закрываем контекстное меню если производится попытка открыть
            // вне области применения
            close_context_menu();
            close_input_element();
        };
    //}catch (error) {};

});



function cell_click(){};

// Функция, которая будет вызываться при клике правой кнопке
function handleClick(event) {
    // Проверяем, что клик был левой кнопкой мыши
    try{
        if (event.button === 0) {
            // Получаем элемента на который кликнули
            var element = event.target;
            // Получаем родительский элемент
            var parent_element = element.parentElement;
            // Выводим id в консоль
            check_run(open_click, element, parent_element, 'table-theme');
            check_run(menu_click, element, parent_element, 'menu-cont');
            check_run(cell_click, element, parent_element, 'cell=menu');
            /*if (parent_element.id==="search_menu"){
                close_input(element.id); // закрытие input
            }*/
            close_context_menu();
        };
    }catch (error) {};
};


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
