function startProgress() {
    const progressBar = document.getElementById('progressBar');
    let progressValue = 0;
    const interval = 10; // Интервал обновления в миллисекундах (100ms)
    const duration = 10000; // Общая продолжительность в миллисекундах (10 секунд)
    const increment = (100 / (duration / interval)); // Увеличение значения прогресса при каждом обновлении

    const progressInterval = setInterval(() => {
        progressValue += increment;
        if (progressValue >= 100) {
            progressValue = 0;
            clearInterval(progressInterval);
        }
        progressBar.value = progressValue;
    }, interval);
}
