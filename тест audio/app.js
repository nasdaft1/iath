let audioChunks = [];
let recorder;
let recordingTimeout;
let isRecording = false;

const uploadUrl = 'https://your-upload-url.com/upload'; // Замените на ваш URL

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      // Отправка аудиофайла на сервер
      uploadAudio(audioBlob);
    };

    document.addEventListener('keydown', startRecording);
    document.addEventListener('keyup', stopRecording);
  })
  .catch(error => {
    console.error("Ошибка доступа к микрофону:", error);
  });

function startRecording(event) {
  if (event.code === 'Space' && !isRecording) {
    isRecording = true;
    audioChunks = [];
    recorder.start();

    recordingTimeout = setTimeout(() => {
      stopRecording();
    }, 15000); // Максимальное время записи - 15 секунд
  }
}

function stopRecording() {
  if (isRecording) {
    isRecording = false;
    clearTimeout(recordingTimeout);
    recorder.stop();
  }
}


let audioContext;
let analyser;
let dataArray;
let bufferLength;




function setupVisualizer(stream) {

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  console.log(bufferLength);

  source.connect(analyser);
}






function drawVisualizer3() {
  // частотник
  //requestAnimationFrame(drawVisualizer);

  analyser.getByteFrequencyData(dataArray);

  const canvas = document.getElementById('oscilloscope');
  const canvasCtx = canvas.getContext('2d');

// Определяем радиус круга и количество линий
const radius = 100;
const numberOfLines = 360; // Количество линий (шаг угла равен 1 градусу)

// Центр круга
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Цикл для отрисовки линий
  for (let i = 0; i < numberOfLines; i++) {
      // Вычисляем угол в радианах
      let angle = i * (Math.PI / 180); // Конвертируем угол в радианы

      // Вычисляем конечные координаты линии по углу
      let x = centerX + radius * Math.cos(angle);
      let y = centerY + radius * Math.sin(angle);

      // Отрисовываем линию от центра к вычисленной точке
      ctx.beginPath();
      ctx.moveTo(centerX, centerY); // Начинаем линию из центра
      ctx.lineTo(x, y); // Рисуем линию к точке на окружности
      ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
      ctx.stroke();
      ctx.closePath();
  }
}


function drawVisualizer() {
  // в лининию
  requestAnimationFrame(drawVisualizer);

  analyser.getByteTimeDomainData(dataArray);

  const canvas = document.getElementById('oscilloscope');
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  
  canvasCtx.lineWidth = 5;             // Толщина линии
  //canvasCtx.strokeStyle = 'blue';        // Цвет линии
  //canvasCtx.shadowColor = 'rgba(0, 0, 255, 0.5)'; // Цвет тени (размытия)
  //canvasCtx.shadowBlur = 15;             // Степень размытия
  canvasCtx.beginPath();
  const sliceWidth = canvas.width * 1.0 / bufferLength;
  let x = 0;
  var centerX = canvas.width/2;
  var centerY = canvas.height/2;
  for (let i = 0; i < bufferLength; i++) {

    let angle = (i*360/bufferLength) * (Math.PI / 180); // Конвертируем угол в радианы

    let radius = 20+dataArray[i] / 2.0
    // Вычисляем конечные координаты линии по углу
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    
    //const v = dataArray[i] / 32.0;
    
    //const y = v * canvas.height / 8 ;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}




function drawVisualizer2() {
  // в лининию
  requestAnimationFrame(drawVisualizer);

  analyser.getByteTimeDomainData(dataArray);

  const canvas = document.getElementById('oscilloscope');
  const canvasCtx = canvas.getContext('2d');

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  
  canvasCtx.lineWidth = 5;             // Толщина линии
  //canvasCtx.strokeStyle = 'blue';        // Цвет линии
  //canvasCtx.shadowColor = 'rgba(0, 0, 255, 0.5)'; // Цвет тени (размытия)
  //canvasCtx.shadowBlur = 15;             // Степень размытия
  canvasCtx.beginPath();
  const sliceWidth = canvas.width * 1.0 / bufferLength;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {

    
    const v = dataArray[i] / 32.0;
    canvasCtx.strokeStyle = `rgba(0,  ${dataArray[i]}, ${dataArray[i]*1.8}, 0.5)`; // Цвет тени (размытия)
    const y = v * canvas.height / 8 ;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}






// Интеграция визуализации с записью
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    setupVisualizer(stream);

    // Теперь можно визуализировать звук
    drawVisualizer();
  })
  .catch(error => {
    console.error("Ошибка доступа к микрофону:", error);
  });



function uploadAudio(audioBlob) {
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
