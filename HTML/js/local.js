// глобальная переменная для визуального состояния дерева файлов и каталогов
globalСonditionTree = {}


/**
 * Функция для получения списка из localStorage
 * @param {String} name  название ключа хранения
 * @returns {number|null}  полученные данные из хранилища
 */
function getlocalStorage(name) {
    let myListString = localStorage.getItem(name);
    return myListString ? JSON.parse(myListString) : {};
}


/**
 * Функция для добавления элемента в список localStorage
 * @param {string} name - название ключа хранения
 * @param {Object} data - Данные передавемые на хранение
 */
function setlocalStorage(name, data) {
    let myListString = JSON.stringify(data);
    localStorage.setItem(name, myListString);
}


/**
 * Получение данных из localStorage при загрузки страницы
 */
window.addEventListener('load', function() {
    globalСonditionTree=getlocalStorage('ListTree')
});

/**
 * Oбытие вызывается, когда пользователь пытается закрыть страницу, 
 * обновить её или перейти на другую страницу.
 */
window.addEventListener('beforeunload', function (event) {
    setlocalStorage('ListTree', globalСonditionTree)
});