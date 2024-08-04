/**
 * Формирование таблицы из массива данных для материалов.
 * @param {Array} data - Первое число.
 */
function materialJsonWriteTable(data) {
    if (data != null) {
        const container = document.getElementById('table-container-material-body');
        container.innerHTML = '';
        for (let row = 0; row < data.length; row++){
            const tr_block = document.createElement('tr');
            tr_block.className = "row-material";
            tr_block.id = `row-${data[row][0]}`;
            const td_block = document.createElement('td');
            td_block.className = "col0";
            tr_block.appendChild(td_block);
            for (let column = 1; column < data[row].length; column++){
                const td_block = document.createElement('td');
                td_block.contenteditable = "true";
                td_block.className = `col${column}`;
                // добавляет чтобы редактировать таблицы
                td_block.setAttribute("contenteditable", "true");
                td_block.textContent = data[row][column];
                //ячейки добавим с строку
                tr_block.appendChild(td_block);
            }
            container.appendChild(tr_block);
        }
        // запись следующего итерабельного значения ключа
        container.setAttribute('id_max', data.length);
    }
}

/**
 * Чтение данных из таблицы в масив данных материалов и формирование данных
 * для отправки на сервер
  * @returns {object} словарь сформированный 
  * data-список 
  * id - идентификатор принадлежащему файлу в дереве
 */
function materialJsonReadTable() {
    data_send={}
    data=[]
    const container = document.getElementById('table-container-material-body');
    const rows = container.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        row_data=[]
        for (let j = 0; j < cells.length; j++) {
            //записать в масиив текст расположенный в ячейке
            row_data.push(cells[j].innerText)
        }
        data.push(row_data)
    }
    data_send['data']=data;
    // id выделенного элемента в дереве
    data_send['id']=tree_focus.id || null;
    return data_send
}

/**
 * для обработки полученных данных с сервера и отправки на формирование 
 * таблицы материалов
 * @param {Array} load_response - список с данными для таблицы
 */
function DataMaterial(load_response){
    const load_data=load_response['data'];
    materialJsonWriteTable(load_data)
}

/**
 * Отправка запроса по изменению данных на сайте. загрузка из json
 * @param {String} method - тип запроса отправляемого на сервер
 * @param {String} url - URL отправляемого на сервер запроса
 */
function fetchDataMaterialAPI(method, url) {
    const data = materialJsonReadTable();
    DataLoadSendApi(method, url, data, DataMaterial);
}
