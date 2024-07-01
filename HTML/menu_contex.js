

class ExchangeBuffer {
    setBuffer(element_id){
        this.id = element_id;
    }

    getBuffer(){
        return this.id;
    }
}


const exchange_buffer = new ExchangeBuffer();


function inputDiv(text_placeholder, path_img){
    // обработка поля ввода визуализаци и фокусировка
    var targetDiv = document.getElementById("search_menu");
    var targetImg = document.getElementById("img_input");
    var targetInput= document.getElementById("search_input");
    targetInput.placeholder =text_placeholder;
    targetInput.value="";
    targetImg.src=path_img;
    targetDiv.style.visibility = "visible";
    document.getElementById("search_input").focus();
}


function search(){
    // поиск
    console.log("Поиск");
    tree_focus.deleteFocus(); //удалить фокус выделение а дереве
    inputDiv('Текст для поиска', 'png/search.png');
    var name='jinx';
    fetchDataWithFetchAPI('GET', `http://213.178.34.212:18000/api/search?name=${name}`);
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
    tree_focus.deleteFocus(); //удалить фокус выделение а дереве
};

function un_roll(){
    // развернуть все дерево
    console.log("Развернуть");
    roll("tree-close.png","png/tree-open.png","flex");
    tree_focus.deleteFocus(); //удалить фокус выделение а дереве
};

function new_label(){
    console.log("Новая заметка");
    // Новая заметка
    inputDiv('Имя новой заметки', 'png/new_label.png');
    //document.getElementById("search_input").focus();
    var name='jax';
    var id_parent='34';
    fetchDataWithFetchAPI('POST', 
        `http://213.178.34.212:18000/api/new_label?id_parent=${id_parent}&name=${name}`);

};

function new_folder(){
    // Новая папка
    console.log("Новая папка");
    inputDiv('Имя новой папки', 'png/new_folder.png');
    var name='jax';
    var id_parent='32';
    fetchDataWithFetchAPI('POST', 
        `http://213.178.34.212:18000/api/new_folder?id_parent=${id_parent}&name=${name}`);
};

function copy(){
    // Новая заметка
    console.log("Копировать",tree_focus.getFocus());
    exchange_buffer.setBuffer(tree_focus.getFocus());
    tree_focus.deleteFocus(); //удалить фокус выделение а дереве
};

function insert(){
    // Новая папка
    console.log("Вставить");
    var id_buffer = exchange_buffer.getBuffer();
    console.log("Взять из ",id_buffer);
    console.log("Вставить в ",tree_focus.getFocus());
    tree_focus.deleteFocus();
    var id_old='2';
    var id_parent='32';
    fetchDataWithFetchAPI('POST', 
        `http://213.178.34.212:18000/api/insert?id_old=${id_old}&id_parent=${id_parent}`);
    
};

function rename(){
    // Новая папка
    console.log("Переименовать");
    inputDiv('Введите новое имя', 'png/rename.png');
    var name='boot';
    var id_index='32';
    fetchDataWithFetchAPI('POST', 
        `http://213.178.34.212:18000/api/rename?id_index=${id_index}&name=${name}`);
};





function delet(){
    // удалеие папки
    console.log("Удалить");
    var del_id = tree_focus.getFocus();
    var element = document.getElementById(del_id);
    tree_focus.setFocus();
    console.log("getFocus id=", del_id);    
    if ((element)&&(del_id!=="folder_root")) {
        fetchDataWithFetchAPI('DELETE', 
            `http://213.178.34.212:18000/api/del?id_index=${del_id}`);
        element.remove();
        
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

