
/**
 * Создание плеера и навешиваие на него эементов управления
 */
class Player{

    constructor() {
        // Код, который нужно выполнить при инициализации класса
    }

    /**
     * остановка аудио воспроизведения
     */
    player_Event_stop(){
        //console.log('stop_audio');
        this.play_stop.style.left='0%';
        this.audio.pause();        // Останавливаем воспроизведение
        this.audio.currentTime = 0; // Сбрасываем позицию к началу
        this.progressFill.style.background = 'conic-gradient(from 0deg, transparent 0deg, #34db34 0deg 360deg, transparent 360deg)';
        setTimeout(() => {//Для корректной отработки возвращение ползунка в исходное состояние при прерывании воспроизведения
            this.progressFill.style.background = 'conic-gradient(from 0deg, transparent 0deg, #34db34 0deg 360deg, transparent 360deg)';
        }, 100)
    }

    /**
     * Функция по навешиванию обработчика событий на нужный нам объект и связывает его с плеером
     */
    player_addEvent(){
        this.audio = document.getElementById('audioPlayer');
        this.progressFill = document.getElementById("progress-circle");
        this.play_stop = document.getElementById("play_stop");
        
        this.audio.addEventListener('timeupdate', () => {
            var percentage = (this.audio.currentTime / this.audio.duration) * 100;
            var degrees = (percentage / 100) * 360;
            this.progressFill.style.background = `conic-gradient(from 0deg, transparent 0deg, #34db34 0deg ${degrees}deg, transparent ${degrees}deg)`;
        });
        // () => используем вместо function () чтобы работали переменные через this
        this.audio.addEventListener('ended', () => {
            this.play_stop.style.left='0%';
            this.progressFill.style.background = 'conic-gradient(from 0deg, transparent 0deg, #34db34 0deg 360deg, transparent 360deg)';
        });
        
        document.getElementById('downloadButton').addEventListener('click', async () => {
            if (this.play_stop.style.left!=='-100%' ){
                try {
                    this.play_stop.style.left='-100%';
                    //console.log('start_audio');
                    const response = await fetch(this.audioURL);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const blob = await response.blob();
                    this.audio.src = window.URL.createObjectURL(blob);;
                    this.audio.play();
                    
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                } 
            } else {
                this.player_Event_stop();
            }
        })
    }

    /**
    * Функция проверяет созан ли прлеек есл создан делает его видимым и переносит
    * текст из ячейки таблицы в поле плеера
    */
    create_player(){
        var player = document.getElementById("audio_play");
        if (player){
            player.style.display='flex';
            var text_new = document.getElementById("audio_play_text_write")
            text_new.textContent = this.cell_textContent; 
            text_new.focus(); // переход на элемент
        }
    }

    /**
    * Функция удалеят плеер в буфер и переносить текст из поля в плееера 
    * в ячейку в таблице где плеер находился
    */
    delete_aydio_player() {
        var player = document.getElementById("audio_play");
        
        if (player){
            this.player = player;
            // чтение текста введенного в поле с плеером
            var text = document.getElementById("audio_play_text_write")
            var parent_element= player.parentElement;
            //var parent_element_text= text.textContent;
            parent_element.removeChild(player);
            // для остановки плеера при перетаскивании 
            var audio = document.getElementById('audioPlayer');
            this.player_Event_stop();  // Останавливаем воспроизведение
            if (parent_element.id !=='form-material'){
                parent_element.textContent=text.textContent;
            }
        }
    }

    /**
    * Функция находит куда необходимо смонтировать плеер. 
    * Если плеер переносится в новую ячейку он удаляется из прежней и прописывается в новую.
    * @param {Object} element - ячека таблицы на которую кликают 
    * @param {Object} parent_elemen - строка ячеки на которую кликают
    */
    move_player(element,parent_element){
        var elevent_class = element.className;
        var row = document.getElementById(parent_element.id);
        var cell = row.querySelector(`.${elevent_class}`);
        var element_new = `${elevent_class} ${row.id}`
        console.log(elevent_class)
        if (this.element_old !== element_new && elevent_class !=='col0'){
            this.delete_aydio_player();
            this.element_old = element_new;
            this.cell_textContent=cell.textContent;
            cell.textContent ='';//убираем текст 
            cell.appendChild(this.player);
            this.create_player();
        }
    }
    
    /**
    * Функция удаляет плеер и очищает буфер с расположением ячейки в таблице. 
    */
    clear_player(){
        console.log(111111);
        player_material.delete_aydio_player();
        player_material.element_old='';
    }

    
}




