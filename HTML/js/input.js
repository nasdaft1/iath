class InputAudio{

    constructor() {
        this.audioChunks = [];
        this.recorder = null;
        this.recordingTimeout = null;
        this.isRecording = false;

        this.uploadUrl = 'http://213.178.34.212:18000/api/v1/training'; // Замените на ваш URL

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
                this.uploadAudio(audioBlob);
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
            this.isRecording = true;
            this.audioChunks = [];
            this.recorder.start();

            this.recordingTimeout = setTimeout(() => {
                this.stopRecording();
            }, 15000); // Максимальное время записи - 15 секунд
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



    uploadAudio(audioBlob) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');

        /*fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Успешно загружено:', data);
        })
        .catch(error => {
            console.error('Ошибка загрузки:', error);
        });*/
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


    /**
     * Для конвертирования данных в нужные нам 
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
        this.key_main = lang[key_main]
        this.key_other = lang[key_other]
    }

    /**
     * Для прикрепление обработки события на вводе данных 
     */
    getEventInputKey(key_main, key_other){
        document.getElementById('input-field').addEventListener('input', function (e) {
            let inputText = e.target.value;
            //let convertedText = convertLayout(inputText, enKeys, ruKeys); // Переключаем с английской на русскую
            let convertedText = convertLayout(inputText, key_main, key_other ); // Переключаем с русскую на английской
            e.target.value = convertedText;
        });
    }
}

const input_audio = new InputAudio();
const input_key = new InputKey();


document.addEventListener('DOMContentLoaded', () => {

})
