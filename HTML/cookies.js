// глобальная переменная для визуального состояния дерева файлов и каталогов
globalСonditionTree = {}


// Функция для установки cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Функция для получения cookies
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


// Сохранение списка в cookies
function saveListToCookie() {
    var myList = ["item1", "item2", "item3"];
    var jsonString = JSON.stringify(myList);
    setCookie("myList", jsonString, 7);
}

// Чтение списка из cookies
function loadListFromCookie() {
    var jsonString = getCookie("myList");
    if (jsonString) {
        var myList = JSON.parse(jsonString);
        console.log(myList);
    } else {
        console.log("No list found in cookies.");
    }
}


window.addEventListener('beforeunload', function (event) {
    // обытие вызывается, когда пользователь пытается закрыть страницу, 
    // обновить её или перейти на другую страницу.
    // Стандартный текст не будет показан в некоторых современных браузерах.
    const message = 'Вы уверены, что хотите покинуть эту страницу?';
    
    // Для старых браузеров
    event.returnValue = message;
    
    // Для современных браузеров
    return message;
});