/**
 * Функция для определения видимости объекта по id 
 * @param {*} id идентификатор объекта по id
 * @returns true если блок отрисован на сайте false - нет
 */
function isVisibleById(id) {
    const element = document.getElementById(id);
    return !!(element && element.offsetWidth > 0 && element.offsetHeight > 0);
}

/**
 * Изменение формы в зависимости от поученных данных с сайта
 * @param {*} data словарь с данными для модификации
 */
function change_form_question(data){
    if (data){
        const microphone = document.getElementById("microphone");
        const input_answer = document.getElementById("input_answer");
        const text_answer = document.getElementById("text_answer");
        const language_answer = document.getElementById("language_answer");
        const question_player = document.getElementById('question-player');
        const question_text = document.getElementById('question-text')

        const id_tree = data['id_tree']
        const id_material = data['id_material']
        const language_input = data['language_input']
        const text = data['text'] || null
        const question_task = data['question']
        const id_audio = data['id_audio'] || null
        const answer_text = data['answer_text'] || null
        console.log('data', data);

        document.getElementById('question-task').textContent = question_task;

        if (id_audio==null){
            question_player.style.display = 'none';
        }
        else {
            question_player.style.display = 'flex';

        }

        if (text===null){
            question_text.style.display = 'none';
        } else {
            question_text.textContent = text;
            question_text.style.display = 'flex';
        }



        if (answer_text===null){
            microphone.style.display = 'none';
            input_answer.style.display = 'flex';
            language_answer.textContent = language_input;
            text_answer.focus();
        } else {
            microphone.style.display = 'block';
            input_answer.style.display = 'none';
        }
    }
}


/**
 * Функция для определения видимости объекта по id 
 * @param {String} Url адрес на который передать данные
 * @param {Object} audioBlob=null буфер файа для передачи на сервер
 * @returns true если блок отрисован на сайте false - нет
 */
function upload(Url, audioBlob = null) {
    console.log('audioBlob',audioBlob)
    const formData = new FormData();
    const jsonData = {
        key1: "value1",
        key2: "value2"
    };
    if (audioBlob !== null){
        formData.append('audio', audioBlob, 'recording.wav');
    }
    formData.append('data', JSON.stringify(jsonData));
    fetch(Url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        this.change_form_question(data);
        console.log('Успешно загружено:', data);
        //console.log('language_input', data['language_input']);
    })
    .catch(error => {
        console.error('Ошибка загрузки:', error);
    });
}


class InputAudio{

    constructor() {
        this.audioChunks = [];
        this.recorder = null;
        this.recordingTimeout = null;
        this.isRecording = false;

        this.Url = 'http://213.178.34.212:18000/api/v1/training/answer-audio'; // Замените на ваш URL

        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null; // Массив данных аудио
        this.bufferLength = null; // Длина буфера

        this.initMedia();
    }

    /**
     * Инициализация настроик для обработки аудио, прикремпление обработки события
     */
    initMedia() {
        
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            this.recorder = new MediaRecorder(stream);
            this.recorder.ondataavailable = event => {
                this.audioChunks.push(event.data);
            };

            this.recorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
                // Отправка аудиофайла на сервер
                upload(this.Url, audioBlob);
            };

            document.addEventListener('keydown', this.startRecording.bind(this));
            document.addEventListener('keyup', this.stopRecording.bind(this));

            this.setupVisualizer(stream);
            this.drawVisualizer();
        })
        .catch(error => {
            console.error("Ошибка доступа к микрофону:", error);
        });
        
    }

    /**
     * Запись аудио в файл в случае нажатия пробела и пока не закончется отведенное время
     * @param {*} event 
     */
    startRecording(event) {
        if (event.code === 'Space' && !this.isRecording) {
            if (isVisibleById('microphone')){
                this.isRecording = true;
                this.audioChunks = [];
                this.recorder.start();

                this.recordingTimeout = setTimeout(() => {
                    this.stopRecording();
                }, 10000); // Максимальное время записи - 15 секунд
            }
        }
    }

    /**
     * Событие определяющее окончание записи по таймеру
     */
    stopRecording() {
        if (this.isRecording) {
            this.isRecording = false;
            clearTimeout(this.recordingTimeout);
            this.recorder.stop();
            console.log('recorder.stop');
        }

    }
    /**
     * Подключение к источнику аудиопотака и настройка буфера и обработчика сигнала
     * @param {*} stream 
     */
    setupVisualizer(stream) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Создание источника аудиосигнала
        const source = this.audioContext.createMediaStreamSource(stream);
        // Создание анализатора
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        // Определение длины буфера и создание массива для данных
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        // Подключение источника к анализатору
        source.connect(this.analyser);
    }

    /**
     * Модуль для отрисовки аудио сигнала
     */
    drawVisualizer() {
        requestAnimationFrame(this.drawVisualizer.bind(this));

        this.analyser.getByteTimeDomainData(this.dataArray);

        // Получаем canvas и контекст для рисования
        const canvas = document.getElementById('oscilloscope');
        const canvasCtx = canvas.getContext('2d');

        // Очищаем холст
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        // Настройки для рисования
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        canvasCtx.lineWidth = 5;
        // Рисуем круги
        if (this.isRecording) {
            for (let i = 0; i < this.bufferLength; i++) {
                // Вычисляем радиус на основе данных из dataArray
                let radius = 21 + this.dataArray[i] / 3.0;
                if (radius > 80) { radius = 80; }
                // Создаем радиальный градиент
                const gradient = canvasCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                gradient.addColorStop(0, 'red');  // Цвет в центре
                gradient.addColorStop(1, 'rgb(200, 200, 200)'); // Цвет на границе круга
                // Используем градиент как заливку
                canvasCtx.fillStyle = gradient;
                // Рисуем круг
                canvasCtx.beginPath();
                canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                canvasCtx.fill();
            }
        }
    }
}




//<input type="text" id="input-field" placeholder="Введите текст...">

/**
 * Для конвертирования данных в нужную нам раскладку в независимости переключил
 * пользователь или нет основную раскладку клавиатуры
 */
class InputKey{
    lang={"ru": "йцукенгшщзхъфывапролджэячсмитьбю",
          "en":"qwertyuiop[]asdfghjkl;'zxcvbnm,."    }

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.Url = 'http://213.178.34.212:18000/api/v1/training/answer-text'; // Замените на ваш URL
            this.keyboardLayout('ru','en')
            this.InitEventInputKey();
        })
    }

    /**
     * Для конвертирования данных в нужные нам вариант раскладки клавиатуры 
     * @param {String} input - вводимый текст 
     * @param {String} fromLayout - строка с раскладкой исходной клавиатуры
     * @param {String} toLayout - строка с раскладкой клавиатуры для ввода
     */
    convertLayout(input, fromLayout, toLayout) {
        //if fromLayout - сделать проверку на fromLayout, toLayout not null
        // что бы исключить ошибки 
        return input.split('').map(char => {
            const index = fromLayout.indexOf(char.toLowerCase());
            if (index !== -1) {
                return char === char.toLowerCase() 
                    ? toLayout[index] 
                    : toLayout[index].toUpperCase();
            }
            return char;
        }).join('');
    }
    /**
     * Назначаем какой раскладкой клавиатуры вводить в поле
     * @param {String} key_main - какая раскладка стоит
     * @param {String} key_other - на какую раскладку переключаем
     */
    keyboardLayout(key_main, key_other){
        this.key_main = this.lang[key_main]
        this.key_other = this.lang[key_other]
    }

    /**
     * Для прикрепление обработки события на вводе данных 
     */
    InitEventInputKey(){
        const inputElement = document.getElementById('text_answer');
        inputElement.addEventListener('input', (e) => {
            let inputText = e.target.textContent;
            let convertedText = this.convertLayout(inputText, this.key_main, this.key_other ); // Переключаем с русскую на английской
            e.target.textContent = convertedText;
        });
        // Добавляем обработчик события нажатия клавиши
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                console.log('Нажата клавиша Enter');
                upload(this.Url)
                // Здесь можно добавить код, который должен выполняться при нажатии Enter
            }
        });
    }
}


const input_audio = new InputAudio();
const input_key = new InputKey();


document.addEventListener('DOMContentLoaded', () => {
    
})
