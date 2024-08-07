/**
 * Функция для добавления элемента в список
 * @param {string} id_row - id номер ряда.
 * @returns {string|null} вырезанный ряд из таблицы
 */
function delete_remove(id_row){
    // для удаление из таблицы строки по id 
    // return: удаленная стока 
    var row = document.getElementById(id_row);
    if (row) {
        return row.parentNode.removeChild(row);
    }
    return null;
}

/**
 * Функция для добавления элемента в список
 * @param {string} table - id номер ряда.
 * @param {string} rowId - id номер ряда.
 * @returns {number|null} словарь сформированный 
 */
function find_index_table(table, rowId){
    for (var i = 0; i < table.rows.length; i++) {
        if (table.rows[i].id === rowId) {
            // Если ID строки совпадает с заданным, выводим индекс
            console.log("Index of row with ID " + rowId + " is: " + i);
            return i;
        }
    }
    return null; //не найдено
}

/**
 * Функция для добавления элемента в список
 * @param {string} id_row - id номер ряда.
 * @param {number} index_add - 0 добавляем перед элементом 1 после элемента.
 * @returns {string} словарь сформированный 
 */
function row_add(id_row, index_add=0){
    //вставка строки с данными с верху курсора в таблицы материалов 
    //если есть данные в буфере иначе вставляются пустые
    //index_add 0 перед курсором вставится блок 1 - после курсора
    console.log('вставить строку выше курсора');
    var row = document.getElementById(id_row);
    // Клонируем оригинальную строку
    var rowBuffer = material_focus.getBufferRow();
    let clonedRow = null;
    // Если в буфере есть данные они вставляются в таблицу
    if (rowBuffer!=null){
        clonedRow = rowBuffer.cloneNode(true)
    } else {
        clonedRow = row.cloneNode(true);    
    }
    var table = document.getElementById('table-container-material-body');
    var id_max =  parseInt(table.getAttribute('id_max'))
    id_max+=1;
    //назначем новый уникальный id в атрибутах таблицы 
    table.setAttribute('id_max', id_max);
    //назначем новый уникальный id
    clonedRow.id=`row-${id_max}`;
    // поиск индекса куда вставим строку
    var index = find_index_table(table,id_row);
    table.insertBefore(clonedRow, table.rows[index+index_add]);
    
}

/**
 * Поиск в материалах
 */
function search_material(){
    console.log('поиск в материалах');
}

/**
 * Копирование данных строки таблицы в буффер
 * @param {string} id_row - id номер ряда.
 */
function row_copy(id_row){
    console.log('копировать строку');
    var row = document.getElementById(id_row);
    material_focus.setBufferRow(row);
}

/**
 * Функция для добавления элемента в список с верху выделенного ряда
 * @param {string} id_row - id номер ряда.
 */
function row_add_up(id_row){
    row_add(id_row)
}

/**
 * Вставка строки с данными с низу курсора в таблицы материалов 
 * если есть данные в буфере иначе вставляются пустые
 * @param {string} id_row - id номер ряда.
 */
function row_add_down(id_row){
    console.log('вставить строку ниже курсора');
    row_add(id_row, 1)
}

/**
 * Вырезаение строки с данными таблицы материалов и отправки в буфер
 * @param {string} id_row - id номер ряда.
 */
function row_remove(id_row){
    console.log('вырезание строки');
    material_focus.setBufferRow(delete_remove(id_row))
}

/**
 * Очистка буфера с данными таблицы материалов
 */
function material_buffer_clear(){
    console.log('очистка буфера');
    material_focus.clearBufferRow();
}


/**
 * Удаление строки с данными в таблицы материалов 
 * @param {string} id_row - id номер ряда.
 */
function row_delete(id_row){
    console.log('удаление строки');
    delete_remove(id_row)
}

/**
 * Oбработка контекстного меню
 * @param {Object} menu_cont - Первое число.
 */
function material_click(menu_cont){
    var id_menu_cont = menu_cont.id;
    // убираем если плеер был в таблице, что бы не производилось его копирование 
    player_material.clear_player();
    const id_row = material_focus.getSelectRow();
    if (id_menu_cont==="search_material"){ search_material();
        } else if (id_menu_cont==="copy_material"){ row_copy(id_row);
        } else if (id_menu_cont==="add_up_row"){ row_add_up(id_row);
        } else if (id_menu_cont==="add_down_row"){ row_add_down(id_row);
        } else if (id_menu_cont==="cut_row"){ row_remove(id_row);
        } else if (id_menu_cont==="delete_buffer"){ material_buffer_clear();
        } else if (id_menu_cont==="delete_row"){ row_delete(id_row);
    }
};
