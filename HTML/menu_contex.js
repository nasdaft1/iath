




function inputDiv(text_placeholder, path_img){
    // обработка поля ввода визуализаци и фокусировка
    var targetDiv = document.getElementById("search_menu");
    var targetImg = document.getElementById("img_input");
    var targetInput= document.getElementById("tree_input");
    targetInput.placeholder =text_placeholder;
    targetInput.value="";
    targetImg.src=path_img;
    targetDiv.style.visibility = "visible";
    document.getElementById("tree_input").focus();
}


function search(){
    // поиск
    console.log("Поиск");
    tree_focus.deleteFocus(); //удалить фокус выделение а дереве
    inputDiv('Текст для поиска', 'png/search.png');
    var name='jinx';
    fetchDataWithFetchAPI('GET', `http://213.178.34.212:18000/api/v1/tree/search?name=${name}`);
};


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


function roll_up(){
    // свернуть все дерево
    roll("tree-open.png","png/tree-close.png",'none');
    console.log("Свернуть");
};

function un_roll(){
    // развернуть все дерево
    console.log("Развернуть");
    roll("tree-close.png","png/tree-open.png","flex");
};

function new_label(){
    console.log("Новая заметка");
    // Новая заметка
    inputDiv('Имя новой заметки', 'png/new_label.png');

    const data = {"id_path":tree_focus.id_path, 'name': 'jax'}
    fetchDataWithFetchAPI('POST', 
        `http://213.178.34.212:18000/api/v1/tree/new_label`, data);

};

function new_folder(){
    // Новая папка
    console.log("Новая папка");
    inputDiv('Имя новой папки', 'png/new_folder.png');
    const data = {"id_path":tree_focus.id_path, 'name': 'jax'}
    fetchDataWithFetchAPI('POST', 
        `http://213.178.34.212:18000/api/v1/tree/new_folder`, data);
};

function copy(){
    // Новая заметка
    console.log("Копировать");
    //exchange_buffer.setBuffer(tree_focus.getFocus());
    tree_focus.copy_in_buffer();
    tree_focus.deleteFocus(); //удалить фокус выделение а дереве
};

function insert(){
    // Новая папка
    console.log("Вставить");
    tree_focus.deleteFocus();
    const data = {"id_path_copy":tree_focus.id_path_buffer,
                  "id_path_insert":tree_focus.id_path}
    fetchDataWithFetchAPI('POST', 
        `http://213.178.34.212:18000/api/v1/tree/insert`, data);
};

function rename(){
    // Новая папка
    console.log("Переименовать");
    inputDiv('Введите новое имя', 'png/rename.png');
    var name='xxxx.txt';
    const data = {"id_path":tree_focus.id_path, 'name': 'xxxx.txt'}
    fetchDataWithFetchAPI('POST', 
        `http://213.178.34.212:18000/api/v1/tree/rename`, data);
};





function delet(){
    // удалеие папки
    console.log("Удалить");
    tree_focus.setFocus();
    const data = {id_path:tree_focus.id_path}
    if ((element)&&(del_id!==0)) {
        fetchDataWithFetchAPI('DELETE', 
            `http://213.178.34.212:18000/api/v1/tree/del`,
            data);
    } else {
        console.log("не найден для удаления id=", del_id);    
    }
};


// обработка контекстного меню
function menu_click(menu_cont){
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

