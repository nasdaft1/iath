/**
 * Запуск визуализации поле ввода в дереве
 * обработка поля ввода визуализаци и фокусировка
 * @param {string} text_placeholder - текст в поле ввода.
 * @param {string} path_img - путь к дял иконки рядом с полем ввода.
 */
function inputDiv(text_placeholder, path_img){
    var targetDiv = document.getElementById("search_menu");
    var targetImg = document.getElementById("img_input");
    var targetInput= document.getElementById("tree_input");
    targetInput.placeholder =text_placeholder;
    targetInput.value="";
    targetImg.src=path_img;
    targetDiv.style.visibility = "visible";
    document.getElementById("tree_input").focus();
}

/**
 * Поиск данных и отправка запроса на сервер
 */
function search(){
    // поиск
    console.log("Поиск");
    tree_focus.deleteFocus(); //удалить фокус выделение а дереве
    inputDiv('Текст для поиска', 'png/menu-contex/search.png');
    tree_focus.setEnterTreeInput('POST', 
        `http://213.178.34.212:18000/api/v1/tree/search`)
};

/**
 * Функция сворачивает разворачивает дерево
 * @param {string} name_old_png - путь у иконок который ищем.
 * @param {string} name_new_png - путь у иконок на который меняем.
 * @param {string} element_display - видимость блока flex, none.
 */
function roll(name_old_png, name_new_png, element_display){
    // для сворачивания и разворачивания дерева с каталогами 
    var formTables = document.querySelectorAll(".table-theme");
    const lenght_name_old_png =name_old_png.length;
    // console.log(lenght_name_old_png, name_old_png);
    // Перебрать все элементы
    formTables.forEach(function(table, index) {
        var element= document.getElementById(table.id);
        var nextDepth=Number(element.getAttribute('depth'));
        var iconImgAll = element.querySelectorAll('img');
        var iconImg = iconImgAll[nextDepth].src;
        if (nextDepth !== 0){
            element.style.display = element_display
            if (element_display === 'none') {
                // передать в глабальную переменную состояние видимости дерева
                delete globalСonditionTree[String(element.id)]
            }
            else{
                // передать в глабальную переменную состояние не видимости дерева
                globalСonditionTree[String(element.id)]= 1
            }
        }
        if (iconImg.slice(-lenght_name_old_png) === name_old_png){
            iconImgAll[nextDepth].src = name_new_png;
        }
    });
}

/**
 * Сворачивание всего дерева 
 */
function roll_up(){
    // +свернуть все дерево
    tree_focus.deleteFocus();
    roll("tree-open.png","png/tree/tree-close.png",'none');
    console.log("Свернуть");
};

/**
 * Разворачивание всего дерева 
 */
function un_roll(){
    // +развернуть все дерево
    tree_focus.deleteFocus();
    console.log("Развернуть");
    roll("tree-close.png","png/tree/tree-open.png","flex");
};

/**
 * Создание нового файла в дереве, формирование и отправка запроса на сервер
 */
function new_label(){
    console.log("Новая заметка");
    // Новая заметка
    inputDiv('Имя новой заметки', 'png/menu-contex/new_label.png');
    tree_focus.setEnterTreeInput('POST', 
        `http://213.178.34.212:18000/api/v1/tree/new_label`)
    

};

/**
 * Создание новой папки в дереве, формирование и отправка запроса на сервер
 */
function new_folder(){
    // Новая папка
    console.log("Новая папка");
    inputDiv('Имя новой папки', 'png/menu-contex/new_folder.png');
    tree_focus.setEnterTreeInput('POST', 
        `http://213.178.34.212:18000/api/v1/tree/new_folder`)
    
};

/**
 * Копирование файла или папки в буфер в дереве
 */
function copy(){
    // +Новая заметка
    console.log("Копировать");
    tree_focus.copy_in_buffer();
    tree_focus.deleteFocus();
};

/**
 * Вставить из буфера в дерево, формирование и отправка запроса на сервер
 */
function insert(){
    // +Вставить из буффера
    console.log("Вставить");
    const data = {"id_path_copy":tree_focus.id_path_buffer,
                  "id_path_insert":tree_focus.id_path};
    console.log("Вставить",data);                  
    fetchDataWithFetchAPI('POST',
        `http://213.178.34.212:18000/api/v1/tree/insert`, 
        data, tree_focus.id_path_last);
};

/**
 * Переименование папок и файлов в дереве, формирование и отправка запроса на сервер
 */
function rename(){
    // +Переименование папок и файлов
    console.log("Переименовать");
    inputDiv('Введите новое имя', 'png/menu-contex/rename.png');
    tree_focus.setEnterTreeInput('POST', 
        `http://213.178.34.212:18000/api/v1/tree/rename`);
};


/**
 * Удаление папки в дереве или файла формирование и отправка запроса на сервер
 */
function delet(){
    console.log("Удалить");
    fetchDataWithFetchAPI('DELETE',
        `http://213.178.34.212:18000/api/v1/tree/del`,
        {"id_path":tree_focus.id_path});
};


/**
 * проверяет по id что выбрано в контексном менб при кликанье 
 * на таблицу с материалами
 * @param {Object} menu_cont - Y
 */
function menu_click(menu_cont){
    // обработка контекстного меню
    var id_menu_cont = menu_cont.id;
    if (id_menu_cont==="search"){ search();
    } else if (id_menu_cont==="roll_up"){ roll_up();
    } else if (id_menu_cont==="un_roll"){ un_roll();
    } else if (id_menu_cont==="new_label"){ new_label();
    } else if (id_menu_cont==="new_folder"){ new_folder();
    } else if (id_menu_cont==="copy"){ copy();
    } else if (id_menu_cont==="insert"){ insert();
    } else if (id_menu_cont==="rename"){ rename();
    } else if (id_menu_cont==="delete"){delet();}
};

