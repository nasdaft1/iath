document.addEventListener('DOMContentLoaded', () => {
    var audio = document.getElementById('audioPlayer');

    //var progressFill = document.getElementById('audioPlayer');
    var progressFill = document.getElementById("progress-circle");
    var play_stop = document.getElementById("play_stop");
    
    audio.addEventListener('timeupdate', function () {
        //play_stop.style.left='-100%';
        var percentage = (audio.currentTime / audio.duration) * 100;
        var degrees = (percentage / 100) * 360;
        console.log(degrees)
        progressFill.style.background = `conic-gradient(from 0deg, transparent 0deg, #34db34 0deg ${degrees}deg, transparent ${degrees}deg)`;
    });

    audio.addEventListener('ended', function () {
        play_stop.style.left='0%';
        console.log('degrees-ended')
        progressFill.style.background = 'conic-gradient(from 0deg, transparent 0deg, #34db34 0deg 359deg, transparent 359deg)';
    });



    document.getElementById('downloadButton').addEventListener('click', async () => {
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
            var progressFill = document.getElementById("progress-circle");
            audio.pause();        // Останавливаем воспроизведение
            audio.currentTime = 0; // Сбрасываем позицию к началу
            progressFill.style.background = 'conic-gradient(from 0deg, transparent 0deg, #34db34 0deg 360deg, transparent 360deg);';
            console.log(1,progressFill.style.background);
        }
    })
})