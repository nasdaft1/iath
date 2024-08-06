/**
 * Функция по созданию блоков и наделению их атрибутами
 * @param {String} block_name  - название id блока на который вешаем событие клика
 * @param {Object} list_argument  - словарь атрибутов прикрепляемые к создаваемому блоку
 * @param {Array|null} list_element  - список appendChild прикрепляемых других блоков
 * @returns {Object} Созданный новаый блок с атрибутами и вложенными блоками
 */

function add_element(block_name, list_argument = {}, list_element=null){
    var create_block= document.createElement(block_name);
    // Проверяем и устанавливаем id, если он передан
    if (list_argument['id']){ 
        create_block.id = list_argument['id']
        console.log('id');
    }
    // Проверяем и устанавливаем className, если он передан
    if (list_argument['className']){ 
        create_block.className = list_argument['className']
        console.log('class');
    }
    // Проверем на наличие возможности редактировать контент блока
    if (list_argument['contenteditable']){ 
        create_block.setAttribute('contenteditable', list_argument['contenteditable'])
    }

    // Если список элементов передан, добавляем их к созданному блоку
    if (list_element !== null) {
        for (const item of list_element) {
            // Проверяем, является ли item узлом, чтобы можно было использовать appendChild
            if (item instanceof Node) {
                create_block.appendChild(item);
            } else {
                console.error('Элемент списка не является узлом:', item);
            }
        }
    }
    return create_block
}



/**
 * Создание плеера для таблицы материалов
 */
function player_create(){
    const triangle_left = add_element('div',{'className':'triangle-left'})
    const progress_stop = add_element('div',{'className':'progress_stop'})
    const play_stop_1 = add_element('div',{'id':'play_stop_1'}, [triangle_left, progress_stop])
    const play_stop = add_element('div',{'className':'play_stop'}, [play_stop_1])

    const arc_2 = add_element('div',{'className':'arc-2'})
    const arc = add_element('div',{'className':'arc', 'id':'progress-circle'})
    const arc_container = add_element(
        'div',{'className':'arc-container', 'contenteditable': 'false',
        'id':'downloadButton'}, [play_stop, arc_2, arc])
    
    const audio_play_text_write = add_element('div',
        {'id':'audio_play_text_write', 
         'className':'audio_play_text_write', 
         'contenteditable': 'true'})
    const audio_play_text = add_element('div',
        {'className':'audio_play_text', 'contenteditable': 'false'}, [audio_play_text_write])
    const audio_play = add_element(
        'div',{}, [arc_container, audio_play_text])
}


/**
 * Функция по навешиванию обработчика событий на нужный нам объект и связывает его с плеером
 * @param {String} name_id - название id блока на который вешаем событие клика
 */
function player_addEvent(name_id){
    var audio = document.getElementById('audioPlayer');
    var progressFill = document.getElementById("progress-circle");
    var play_stop = document.getElementById("play_stop");
    
    audio.addEventListener('timeupdate', function () {
        //play_stop.style.left='-100%';
        var percentage = (audio.currentTime / audio.duration) * 100;
        var degrees = (percentage / 100) * 360;
        progressFill.style.background = `conic-gradient(from 0deg, transparent 0deg, #34db34 0deg ${degrees}deg, transparent ${degrees}deg)`;
    });

    audio.addEventListener('ended', function () {
        play_stop.style.left='0%';
        console.log('degrees-ended')
        progressFill.style.background = 'conic-gradient(from 0deg, transparent 0deg, #34db34 0deg 360deg, transparent 360deg)';
    });

    
    document.getElementById(name_id).addEventListener('click', async () => {
        // скачивание аудиофайла с ресурса 
        var play_stop = document.getElementById("play_stop");
        const audioPlayer = document.getElementById('audioPlayer');
        
        if (play_stop.style.left!=='-100%' ){
            try {
                play_stop.style.left='-100%';
                console.log('start_audio');
                const response = await fetch('http://213.178.34.212:18000/api/v1/download-audio');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                audioPlayer.src = url;
                audioPlayer.play();
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            } 
        } else {
            console.log('stop_audio');
            play_stop.style.left='0%';
            //const progressFill_1 = document.getElementById("progress-circle");
            audio.pause();        // Останавливаем воспроизведение
            audio.currentTime = 0; // Сбрасываем позицию к началу
            progressFill.style.background = 'conic-gradient(from 0deg, transparent 0deg, #34db34 0deg 360deg, transparent 360deg)';
            setTimeout(() => {//Для корректной отработки возвращение ползунка в исходное состояние при прерывании воспроизведения
                progressFill.style.background = 'conic-gradient(from 0deg, transparent 0deg, #34db34 0deg 360deg, transparent 360deg)';
            }, 100)
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {




    
})