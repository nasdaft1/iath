function search(){
    // свернуть все дерево
    console.log("Поиск");
    var targetDiv = document.getElementById("search_menu");
    targetDiv.style.visibility = "visible";
    document.getElementById("search").focus();
    };

function roll_up(){
    // свернуть все дерево
    console.log("Свернуть");
};

function un_roll(){
    // развернуть все дерево
    console.log("Развернуть");
};

function new_label(){
    console.log("Новая заметка");
    // Новая заметка
};

function new_folder(){
    // Новая папка
    console.log("Новая папка");
};

function copy(){
    // Новая заметка
    console.log("Копировать");
};

function insert(){
    // Новая папка
    console.log("Вставить");
};

function rename(){
    // Новая папка
    console.log("Переименовать");
};

function delet(){
    // Новая папка в корневом
    console.log("Удалить");
};


// обработка контекстного меню
function menu_click(id_menu_cont){
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

