var context_menu_heigh;


document.addEventListener('DOMContentLoaded', function() {
    // высота контекстного меню 
    var context_menu_element=document.getElementById("contextMenu");
    var context_menu_heigh_str=window.getComputedStyle(context_menu_element).height;
    context_menu_heigh = parseInt(context_menu_heigh_str, 10) // в число
});


class TreeFocus {
    setFocus(element=undefined) {
        // выставление выделение на tree
        // Без атрибутов сбрасывается в дефолт
        // console.log('set_id= ', this.id)
        if (element!==undefined) {
            this.id = element.id;
            this.targetDiv = document.getElementById(element.id);
            this.targetDiv.style.outline = "2px solid #007bff";
            // console.log(this.id)
        } else {
            this.id = undefined; // дефолтное значение
        }
    };

    deleteFocus() {
        // удаление выделение на tree
        if (this.id !== undefined){
            this.targetDiv = document.getElementById(this.id);
            // this.targetDiv.style.outline = "2px solid #707070";
            this.targetDiv.style.outline = "none";
        };
    };

    getFocus() {
        // получеие id выделение на tree
        return this.id;
    };

};


// Пример использования
const tree_focus = new TreeFocus();


function close_context_menu(){
    // Закрытие констектного меню
    var element_menu = document.getElementById("contextMenu") 
    element_menu.style.display = 'none';
    // tree_focus.deleteFocus();
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
    document.getElementById("search_input").value = '';
    tree_focus.deleteFocus();
}


function close_input(element_id) {
    // проверка закрытие поле input по Х и очитава от введеных данных
    console.log("Закрыть поиск",element_id);
    if (element_id==="close_input") {
        close_input_element();
    }
}

function tree_focus_set(element){
    tree_focus.setFocus(element)
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
    
    close_input_element(); // закрыть search_menu
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
        tree_focus.deleteFocus();
        check_run(tree_focus_set, clickedElement, parentElement, "table-theme")
        check_run(tree_focus_set, clickedElement, parentElement, "cell-menu")
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
    };
});



function cell_click(){
    // console.log('11111111111111111')
};

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
        if (parent_element.id==="search_menu"){
            close_input(element.id); // закрытие input
        }
        close_context_menu();
    };
};

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
