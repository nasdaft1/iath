// Определяем функцию, которую будем вызывать
/*function myFunction() {
    console.log('Функция вызвана!');
    
    //для вызова функции через определенныо время саму себя
    setTimeout(myFunction, 500);
}

// Начинаем вызов функции первый раз
myFunction();

/*
const hoverElement = document.getElementById('form-table');
hoverElement.addEventListener('mouseover', function (event) {}
*/
var OldElement = ''
var idElement = ''


class Help {
    setDescription(element=null){
        var menu = document.getElementById("contextMenu") 
        if (menu.style.display=='none'){
            var element_id = document.getElementById(element.id);
            const rect = element_id.getBoundingClientRect();
            const top = rect.top;
            const right = Number(rect.right+30);
            //console.log('elementHelp',document.getElementById('help'))
            const elementHelp = document.getElementById('help');
            elementHelp.style.display = 'block';
            elementHelp.style.top = top+'px';   // Новая координата по вертикали
            elementHelp.style.left = right + 'px';   // Новая координата по вертикали
            
        }
    };

    delDescription(){
        const elementHelp = document.getElementById('help');
        elementHelp.style.display = 'none';
    }

}

const HelpClass = new Help();

function get_help(element){
    if (idElement!==element){
        idElement = element
        HelpClass.setDescription(element);
        }
    return null
}

document.addEventListener('mousemove', (event) => {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    var childElement = event.target;
    if (childElement.className === 'table-theme' || 
        childElement.className === 'table-theme-add'){
    
        if (OldElement !==childElement){
            //try {
                var parentElement = childElement.parentElement;
                OldElement=childElement
                check_run(get_help, childElement, parentElement, "table-theme")   
            //} catch (error) {}
        }
    } else if (childElement.className === 'table') {
        HelpClass.delDescription();
    } else {
        HelpClass.delDescription();
    }
    
    
    // var parentElement = childElement.parentElement;
    // console.log(childElement)
    // check_run(get_help, childElement, parentElement, "table-theme")   
});