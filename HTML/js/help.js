
var idElement = '' //для определение старого состояния блока help

/**
 * Класс, устанавливающий и убирающий блок help
 */
class Help {
    id = null // id элемента связанный с блоком help
    id_old = null //проверка сотояния по таймеру предыдущее 
    top =null //позиция по вертикали строки help
    left = null //позиция по горизонтали строки help

    /**
     * Установка подсказки help на дереве
     * @param {Object} element - объект на каторый пповесится help
     */
    setDescription(element=null){
        this.id = element.id
        var element_id = document.getElementById(element.id);
        this.id=element_id.id;
        const rect = element_id.getBoundingClientRect();
        this.top = rect.top -70;
        this.left = Number(rect.right)+30;

        const elementHelp = document.getElementById('help');
        elementHelp.style.display = 'none';
        this.id_old = null;
    };

    /**
     * Удаление подсказки help на дереве
     */
    delDescription(){
        const elementHelp = document.getElementById('help');
        elementHelp.style.display = 'none';
        this.id = null;
    }

    /**
     * Для высвечивание строки help при длительной задержки на элементе
     */
    setCheck(){
        var menu = document.getElementById("contextMenu") 
        // console.log('ddLL', this.id, this.id_old) 
        if (this.top!== null && 
            menu.style.display!=='block' &&
            this.id === this.id_old &&
            this.id !== null
        ){
            const elementHelp = document.getElementById('help');
            elementHelp.style.display = 'block';
            elementHelp.style.top = this.top+'px';   // Новая координата по вертикали
            elementHelp.style.left = this.left + 'px';   // Новая координата по вертикали
        }
        this.id_old = this.id
    }

}

const HelpClass = new Help();

/**
 * Функция определя открыт help на данном элементе или на другом
 * @param {Object}  element - глубина дерева
 */
function get_help(element){
    if (idElement!==element){
        idElement = element
        HelpClass.setDescription(element);
        }
}

// Остлеживать наведение на элементы дерева для вывода подсказки help
document.addEventListener('mousemove', (event) => {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    var childElement = event.target;
    if (
        childElement.className === 'table-theme-add' ||
        childElement.className === 'table-theme-text'){
        try {
            var parentElement = childElement.parentElement;
            
            check_run(get_help, childElement, parentElement, "table-theme")   
        } catch (error) {console.log(error)}
    } else if (childElement.className === 'table') {
        HelpClass.delDescription();
    } else {
        HelpClass.delDescription();
    }
});


/**
 * Вывод сообщение об ошибки
 
 */
function messageError(text) {
    const elementError = document.getElementById('error');
    const elementErrorH3 = document.getElementById('error-h3');
    const form_question = document.getElementById('form-question');
    elementErrorH3.innerHTML = text;    
    elementError.style.display = 'block';
    var question_display = form_question.style.display;
    form_question.style.display = 'none';
    setTimeout(() => {
        elementError.style.display = 'none';
        elementErrorH3.innerHTML = '';    
    form_question.style.display = question_display;
        }, 3500);
}



/**
 * Определяем функцию, которую будем вызывать через определенное время
 * раз за разом
 */
function myFunction() {
    HelpClass.setCheck();
    //для вызова функции через определенныо время саму себя
    setTimeout(myFunction, 1600);
}

// Начинаем вызов функции первый раз
myFunction();

/*
const hoverElement = document.getElementById('form-table');
hoverElement.addEventListener('mouseover', function (event) {}
*/