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

    clearNewRow(){
        console.log(1);
        const container = document.getElementById('table-container-material-body');
        const id_max = parseInt(container.getAttribute('id_max'));
        const tr_block = document.createElement('tr');
        tr_block.className = "row-material";
        tr_block.id = `row-${id_max}`;
        const td_block = document.createElement('td');
        td_block.className = "col0";
        tr_block.appendChild(td_block);
        for (let column = 0; column < 3; column++){
            const td_block = document.createElement('td');
            
            
            td_block.className = `col${column+1}`;
            td_block.setAttribute("id_audio", 'null');
            td_block.setAttribute("change", 'true');
            td_block.textContent = 'text_content';
            tr_block.appendChild(td_block);
            
        }
        console.log(tr_block)
        container.appendChild(tr_block);
        container.setAttribute('id_max', id_max + 1);
        
    }
}

// Пример использования
const tree_focus = new TreeFocus();
const material_focus = new MaterialFocus();


/**
 * проверяет по высоте отрисоваемой части таблицы с данными есть там данные или нет
 */
function check_no_data_table(){
    const element = document.getElementById('table-container-material-body');
    if (element.getBoundingClientRect().height === 0 ){
        document.getElementById("no-data-table").style.display ="flex"
    } else {
        document.getElementById("no-data-table").style.display ="none"
    }
}

/**
 * Функция для добавления элемента в список
 * @param {string} id_row - id номер ряда.
 * @returns {string|null} вырезанный ряд из таблицы
 */
function delete_remove(id_row) {
    var row = document.getElementById(id_row);
    if (!row) return null;
    var row_parent = parseInt(row.parentNode.getAttribute('delete_max') || 0) + 1;
    row.setAttribute('delete', row_parent);
    row.parentNode.setAttribute('delete_max', row_parent);
    check_no_data_table() // проверка удалили мы последние данные
    return 1;
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
    // id_max+=1;
    //назначем новый уникальный id в атрибутах таблицы 
    table.setAttribute('id_max', id_max+1);
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
 * Вставить строку в конец таблицы
 */
function row_add_end(){
    console.log('вставить строку в конец таблицы');
    material_focus.clearNewRow();
    check_no_data_table() // проверка удалили мы последние данные
}

/**
 * Копирование данных строки таблицы в буффер
 * @param {string} id_row - id номер ряда.
 */
function row_copy(id_row){
    console.log('копировать строку');
    var row = document.getElementById(id_row);
    console.log(row);
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
    check_no_data_table()
}

/**
 * изменение визуализации некоторых элементов контекстного меню
 * в зависимости от области применения 
 * @param {Object} element - элемент который меняем визуализацию
 * @param {String} color - цвет контента в элементе
 * @param {String} cursor - тип курсора на элементе
 */
function visible_element(element,color, cursor){
    element.style.color = color;  // отмечается не активный элемент
    element.style.cursor = cursor; // отмечается не активный элемент
}

/**
 * Отключение визуализации некоторых элементов контекстного меню
 * в зависимости от области применения 
 * @param {Object} id_row - id области куда кликнули
 */
function visible_element_menu_material(id_row){
    console.log('id_row', id_row)
    // Находим родительский элемент
    let parent = document.getElementById('block_menu_material');
    // Выбираем все элементы с атрибутом place="in"
    let elements = parent.querySelectorAll('[place="in"]');
    // Проходимся по каждому элементу и изменяем цвет текста
    elements.forEach(function(element) {
        if (id_row ==='table-container-material'){
            visible_element(element,'var(--context-menu-not-activ)','none')
            //element.style.color = 'var(--context-menu-not-activ)';  // отмечается не активный элемент
            //element.style.cursor = 'none'; // отмечается не активный элемент
        } else {
            visible_element(element,'var(--color-text)','default');
            //element.style.color = 'black';  // отмечается активный элемент
            //element.style.cursor = 'default'; // отмечается не активный элемент
        }
    });

    let elements_buffer = parent.querySelectorAll('[place="buffer"]');
    // Проходимся по каждому элементу и изменяем цвет текста
    elements_buffer.forEach(function(element_buffer) {
        if (material_focus.getBufferRow() ===null){
            visible_element(element_buffer,'var(--context-menu-not-activ)','none')
            //element_buffer.style.color = 'var(--context-menu-not-activ)';  // отмечается не активный элемент
            //element_buffer.style.cursor = 'none'; // отмечается не активный элемент
        } else {
            visible_element(element_buffer,'var(--color-text)','default');
            //element_buffer.style.color = 'black';  // отмечается активный элемент
            //element_buffer.style.cursor = 'default'; // отмечается не активный элемент
        }
    });

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
    // визуалилировать некоторые элементы меню
    visible_element_menu_material(index)
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


/**
 * Oбработка контекстного меню
 * @param {Object} menu_cont - Первое число.
 */
function material_click(menu_cont){
    var id_menu_cont = menu_cont.id;
    // убираем если плеер был в таблице, что бы не производилось его копирование 
    player_material.clear_player();
    const id_row = material_focus.getSelectRow();
    visible_element_menu_material(id_row)
    console.log(id_row)
    if (id_menu_cont==="search_material"){ search_material();
        } else if (id_menu_cont==="new_material"){ row_add_end();
        } else if (id_menu_cont==="copy_material"){ row_copy(id_row);
        } else if (id_menu_cont==="add_up_row"){ row_add_up(id_row);
        } else if (id_menu_cont==="add_down_row"){ row_add_down(id_row);
        } else if (id_menu_cont==="cut_row"){ row_remove(id_row);
        } else if (id_menu_cont==="delete_buffer"){ material_buffer_clear();
        } else if (id_menu_cont==="delete_row"){ row_delete(id_row);
    }
};
