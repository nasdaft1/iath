/**
 * Формирование таблицы из массива данных для материалов.
 * @param {Array} data - Первое число.
 */
function materialJsonWriteTable(data) {
    if (data != null) {
        if (data.length != 0){
            // убираем надпись "нет данных" в пустой таблицы 
            document.getElementById("no-data-table").style.display ="none"
        }
        const container = document.getElementById('table-container-material-body');
        container.innerHTML = '';
        for (let row = 0; row < data.length; row++){
            const tr_block = document.createElement('tr');
            tr_block.className = "row-material";
            tr_block.id = `row-${row}`;
            const td_block = document.createElement('td');
            td_block.className = "col0";
            tr_block.appendChild(td_block);
            for (let column = 0; column < data[row].length; column++){
                const td_block = document.createElement('td');
                td_block.contenteditable = "true";//?? проверить актуальность
                td_block.className = `col${column+1}`;
                // добавляет чтобы редактировать таблицы
                //td_block.setAttribute("contenteditable", "true");
                var cell = data[row][column]
                td_block.textContent = cell['text_content'];
                td_block.setAttribute("id_audio", cell['id_audio']);
                td_block.setAttribute("change", 'false');
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
    var dict_cell= {}
    const container = document.getElementById('table-container-material-body');
    const rows = container.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        row_data=[]
        // если есть атрибут удаления 
        var delete_row= rows[i].getAttribute('delete');
        for (let j = 1; j < cells.length; j++) {
            dict_cell= {}
            dict_cell['text_content'] = cells[j].innerText //записать текста расположенный в ячейке
            dict_cell['id_audio'] = cells[j].getAttribute('id_audio') //uuid файла в относящегося к таксту
            //ставим маркер на весь ряд состояния рада на удаление
            dict_cell['removal'] = delete_row != null ? parseInt(delete_row) : null;
            dict_cell['change'] = cells[j].getAttribute('change') === 'true';
            row_data.push(dict_cell)
        }
        try{
            data.push(row_data)
        } catch (error){
            console.error('Неверный id у row');
        }

        
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


/**
 * Функция проверки и удаление если имеется аудио плеер в таблицы материалы
 */
function delete_aydio_player(element) {
    var player = document.getElementById("audio_play");
    if (player){
        // чтение текста введенного в поле с плеером
        var text = document.getElementById("audio_play_text_write")
        var parent_element= player.parentElement;
        //var parent_element_text= text.textContent;
        console.log('player ',player)
        console.log('text ',text)
        console.log('parent_element ',parent_element)
        parent_element.removeChild(player);
        console.log('111',parent_element.id);
        if (parent_element.id !=='form-material'){
            parent_element.textContent=text.textContent;
        }
    }
}


const player_material = new Player();

document.addEventListener('DOMContentLoaded', () => {
    player_material.player_addEvent()
    // для теста передаем фиксированную ссылку на аудиофайл
    player_material.audioURL = 'http://213.178.34.212:18000/api/v1/download-audio?id_audio=null'
})



/**
 * Отправка запроса по изменению данных на сайте. загрузка из json
 * @param {Object} element - тип запроса отправляемого на сервер
 */
function chech_click_material(element) {
    var parent_element= element.parentElement;
    if (parent_element.className==='row-material'){
        player_material.move_player(element, parent_element);
    } else {
        // Исключаем удаление плеера при кликанье на сам плеер
        if (element.getAttribute('my-attribute') !=='my-player'){
            // удаляем плеер если кликанье произведено не на таблицу с материалами
            player_material.clear_player();
        }
    }
}

