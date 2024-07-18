// глобальная переменная для визуального состояния дерева файлов и каталогов
globalСonditionTree = {}


// Функция для получения списка
function getlocalStorage(name) {
    let myListString = localStorage.getItem(name);
    return myListString ? JSON.parse(myListString) : {};
}

// Функция для добавления элемента в список
function setlocalStorage(name, data) {
    let myListString = JSON.stringify(data);
    localStorage.setItem(name, myListString);
}



window.addEventListener('load', function() {
    // Получение данных из localStorage при загрузки страницы
    globalСonditionTree=getlocalStorage('ListTree')
    console.log('Все ресурсы страницы загружены!');
    //console.log(globalСonditionTree);
});


window.addEventListener('beforeunload', function (event) {
    // обытие вызывается, когда пользователь пытается закрыть страницу, 
    // обновить её или перейти на другую страницу.
    setlocalStorage('ListTree', globalСonditionTree)
});