class TreeFocus {
    setFocus(element) {
        // выставление выделение на tree
        this.id = element.id;
        this.targetDiv = document.getElementById(element.id);
        this.targetDiv.style.outline = "2px solid #007bff";
    };

    deleteFocus() {
        // удаление выделение на tree
        if (this.id !== undefined){
            this.targetDiv = document.getElementById(this.id);
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
    tree_focus.deleteFocus();
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
        var iconImgNext = nextElement.querySelectorAll('img');
        var iconImgLength = iconImgNext.length -1;
        if (iconImgLength > 0) {
            var iconTextNext = iconImgNext[iconImgLength].src.slice(-13)
            if (iconTextNext ==='tree-open.png'){
                iconImgNext[iconImgLength].src = 'png/tree-close.png';
            };
        };
        if (nextDepth===depth){break;};
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



function open_click(div_id){
    // Найти нужный элемент если кликнули по наследнику
    var targetDiv = document.getElementById(div_id);
    var depth = Number(targetDiv.getAttribute('depth'));
    var folder = targetDiv.getAttribute('folder');
    if ((targetDiv) && (folder ==='true')) {
        var iconImg = targetDiv.querySelectorAll('img');
        if (iconImg.length > 1) {
            check_img(targetDiv, depth, iconImg, iconImg.length-1);
        } else {
            check_img(targetDiv, depth, iconImg, 0);
        };
    };
};


document.addEventListener('contextmenu', function (event) {
    // Предотвращаем появление контекстного меню по умолчанию
    event.preventDefault();
    // Получаем элемент, на который кликнули
    var clickedElement = event.target;
    // Получаем родительский элемент
    var parentElement = clickedElement.parentElement;
    console.log(clickedElement.className);
    console.log(parentElement.className);
    // Проверяем клик был на нужном нам элементе?
    if ((clickedElement.className === "table-theme") || 
            (parentElement.className === "table-theme")) {
        // Получаем координаты клика
        var menu = document.getElementById("contextMenu") 
        tree_focus.deleteFocus();
        if (clickedElement.className === "table-theme") {
            tree_focus.setFocus(clickedElement);
        } else {
            tree_focus.setFocus(parentElement);
        };
        // устанавливаем координаты и отображаем
        menu.style.left = (event.clientX) + "px";
        menu.style.top = (event.clientY -30) + "px";
        menu.style.display = 'block';
    } else {
        // закрываем контекстное меню если производится попытка открыть
        // вне области применения
        close_context_menu();
    };
});


// Функция, которая будет вызываться при клике правой кнопке
function handleClick(event) {
    // Проверяем, что клик был левой кнопкой мыши
    if (event.button === 0) {
        // Получаем элемента на который кликнули
        var element = event.target;
        // Получаем родительский элемент
        var parent_element = element.parentElement;
        
        // Выводим id в консоль
        if (element.className === 'table-theme') {
            open_click(element.id);
        }
        else if (parent_element.className ==='table-theme') {
            open_click(parent_element.id);
        };

        if (element.className === 'menu-cont') {
            menu_click(element.id)
        }
        else if (parent_element.className ==='menu-cont') {
            menu_click(parent_element.id)
        };
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
    }
});
