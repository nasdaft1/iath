
var idElement = ''


class Help {
    id = null
    id_old = null //проверка сотояния по таймеру предыдущее 
    top =null //позиция по вертикали строки help
    left = null //позиция по горизонтали строки help

    setDescription(element=null){
        this.id = element.id
        
        //console.log('LLL', this.id, this.id_old) 
        var element_id = document.getElementById(element.id);
        this.id=element_id.id;
        const rect = element_id.getBoundingClientRect();
        this.top = rect.top;
        this.left = Number(rect.right)+60;

        const elementHelp = document.getElementById('help');
        elementHelp.style.display = 'none';
        this.id_old = null;
    };

    delDescription(){
        const elementHelp = document.getElementById('help');
        elementHelp.style.display = 'none';
        this.id = null;
    }

    setCheck(){
        // для высвечивание строки help при длительной задержки на элементе
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

function get_help(element){
    if (idElement!==element){
        idElement = element
        HelpClass.setDescription(element);
        }
}

document.addEventListener('mousemove', (event) => {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    var childElement = event.target;
    // console.log('ffff', childElement.className) 
    if (
        childElement.className === 'table-theme' ||
        // childElement.className === 'cell-menu' || 
        childElement.className === 'table-theme-add'){
        // console.log('изменения',childElement)
        //try {
            var parentElement = childElement.parentElement;
            check_run(get_help, childElement, parentElement, "table-theme")   
        //} catch (error) {}
    } else if (childElement.className === 'table') {
        HelpClass.delDescription();
    } else {
        HelpClass.delDescription();
    }
});


// Определяем функцию, которую будем вызывать
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