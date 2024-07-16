var context_menu_heigh;





class TreeFocus {
    id_path=[] //путь для выбранного элемента
    id_path_buffer=[] // путь до копируемого элемента
    //name = null
    method = ''
    url = ''

    setFocus(element=undefined, id_path=[]) {
        // выставление выделение на tree
        // Без атрибутов сбрасывается в дефолт
        if (element!==undefined) {
            this.id = element.id;
            this.targetDiv = document.getElementById(element.id);
            this.targetDiv.style.outline = "2px solid #007bff";
        } else {
            this.id = undefined; // дефолтное значение
        }
        this.id_path = id_path
        console.log('path=',this.id_path)
        console.log('id_path_buffer=',this.id_path_buffer)
        console.log('setFocus')
    };

    
    deleteFocus() {
        // удаление выделение на tree
        
        if (this.id !== undefined){
            console.log('deleteFocus()')
            this.targetDiv = document.getElementById(this.id);
            // this.targetDiv.style.outline = "2px solid #707070";
            this.targetDiv.style.outline = "none";
            
        };
    };

    /*createData(){
        // очистка данных
        this.name = null; // очищаем данные с поле ввода
        this.method = '';
        this.url = '';
    }*/

    copy_in_buffer(){
        // копирования пути в буффер пути
        this.id_path_buffer=this.id_path
        console.log('id_path_buffer=',this.id_path_buffer)
    }
    
    /*getPathId(){
        // Получение пути выделенного файла или каталога
        return this.id_path
    }
    getBufferId(){
        // Получение пути выделенного файла или каталога в буфере
        this.id_path=id_path
        return this.id_path_buffer
    }

    setTreeInput(name){
        // значение поле ввода присваивается в переменную если не пустое
        if (name!==''){
            this.name = name
            console.log('name=',this.name)
        }        
    }*/

    setEnterTreeInput(method, url){
        this.method = method;
        this.url = url;
        console.log('method', this.method)
        console.log('url',this.url)
    }

    sendDataEnter(name){
        // if (this.method!=='' && this.url!=='' && this.name!==null){
        if (this.method!=='' && this.url!=='' && name!==null){
            fetchDataWithFetchAPI(this.method,
                this.url, 
                {"id_path":this.id_path, 'name': name});
        } else {
            // console.log('method', this.method)
            // console.log('url',this.url)
            // console.log('mname',this.name)
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
    iconImg[index_icon].src = 'png/tree-open.png'; // Укажите новый URL иконки 
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
    iconImg[index_icon].src = 'png/tree-close.png'; // Укажите новый URL иконки 
    while (nextElement) {
        var nextDepth=Number(nextElement.getAttribute('depth'));
        if (nextDepth<=depth){break;};
        var iconImgNext = nextElement.querySelectorAll('img');
        var iconImgLength = iconImgNext.length -1;
        
        var iconTextNext = iconImgNext[iconImgLength].src.slice(-13)
        
        if (iconTextNext ==='tree-open.png'){
            iconImgNext[iconImgLength].src = 'png/tree-close.png';
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

// Рекурсивная функция для нахождения пути до корневого элемента
function findPathToRoot(id) {
    const path = [];
    let currentElement = document.getElementById(id);
    while (currentElement) {
        path.push(parseInt(currentElement.id));
        x = currentElement.getAttribute('parent_id')
        currentElement = document.getElementById(x);
    }
    path.push(0);
    return path.reverse();
}


function get_path_tree_focus(element){
    const index = element.id
    const pathToRoot = findPathToRoot(index);
    tree_focus.setFocus(element, pathToRoot)
    //console.log(pathToRoot)
    return pathToRoot
}

function check_run(func, element, parent_element, value){
    // Выполнение функции c элемент или родитель который соответствует value
    if (element.className === value){
        func(element)
    }
    else if (parent_element.className === value){
        func(parent_element)
    }
};


document.addEventListener('contextmenu', function (event) {
    // расчет выползания контекстного меню
    // Предотвращаем появление контекстного меню по умолчанию
    event.preventDefault();
    // Получить высоту окна браузера
    var windowHeight = window.innerHeight;
    // Получаем элемент, на который кликнули
    var clickedElement = event.target;
    // Получаем родительский элемент
    var parentElement = clickedElement.parentElement;
    // Проверяем клик был на нужном нам элементе?
    if ((clickedElement.className === "table-theme") || 
        (parentElement.className === "table-theme") || 
        (clickedElement.className ==="cell-menu")||
        (parentElement.className ==="cell-menu")
        ) {
        // Получаем координаты клика
        var menu = document.getElementById("contextMenu") 
        check_run(get_path_tree_focus, clickedElement, parentElement, "table-theme")
        check_run(get_path_tree_focus, clickedElement, parentElement, "cell-menu")
        // устанавливаем координаты и отображаем
        menu.style.left = (event.clientX) + "px";
        // чтобы контекстное меню не выползало из экрана
        if ((context_menu_heigh +event.clientY+30)< windowHeight){
            menu.style.top = (event.clientY -30) + "px";
        } else {
            menu.style.top = (event.clientY -50-context_menu_heigh) + "px";
        }
        menu.style.display = 'block';
    } else {
        // закрываем контекстное меню если производится попытка открыть
        // вне области применения
        close_context_menu();
        close_input_element();
    };
});



function cell_click(){};

// Функция, которая будет вызываться при клике правой кнопке
function handleClick(event) {
    // Проверяем, что клик был левой кнопкой мыши
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
};


function tree_input_handle_Key(event) {
    // обработка нажатия на поле input
    if (event.key === 'Enter' || event.keyCode === 13) {
        console.log('Enter pressed!');
        //tree_focus.setTreeInput(event.target.value);
        const input_text = event.target.value
        close_input_element();
        tree_focus.sendDataEnter(input_text);
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
        console.log('Esc pressed!');
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
